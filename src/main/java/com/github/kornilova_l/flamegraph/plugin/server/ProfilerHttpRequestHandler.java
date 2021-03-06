package com.github.kornilova_l.flamegraph.plugin.server;

import com.github.kornilova_l.flamegraph.plugin.PluginFileManager;
import com.github.kornilova_l.flamegraph.plugin.converters.ProfilerToFlamegraphConverter;
import com.github.kornilova_l.flamegraph.plugin.server.methods_count_handlers.AccumulativeTreesMethodCounter;
import com.github.kornilova_l.flamegraph.plugin.server.methods_count_handlers.CallTreeMethodsCounter;
import com.github.kornilova_l.flamegraph.plugin.server.tree_request_handlers.CallTreeRequestHandler;
import com.github.kornilova_l.flamegraph.plugin.server.tree_request_handlers.HotSpotsRequestHandler;
import com.github.kornilova_l.flamegraph.plugin.server.tree_request_handlers.IncomingCallsRequestHandler;
import com.github.kornilova_l.flamegraph.plugin.server.tree_request_handlers.OutgoingCallsRequestHandler;
import com.github.kornilova_l.flamegraph.plugin.server.trees.Filter;
import com.github.kornilova_l.flamegraph.plugin.server.trees.TreeManager;
import com.github.kornilova_l.flamegraph.plugin.server.trees.TreeManager.TreeType;
import com.github.kornilova_l.libs.com.google.protobuf.Message;
import com.google.gson.Gson;
import com.intellij.openapi.diagnostic.Logger;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.*;
import org.apache.commons.compress.utils.IOUtils;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.jetbrains.ide.HttpRequestHandler;
import org.jetbrains.io.Responses;

import java.io.*;
import java.util.Map;
import java.util.Objects;

import static com.github.kornilova_l.flamegraph.plugin.server.trees.flamegraph_format_trees.StacksParser.isFlamegraph;

public class ProfilerHttpRequestHandler extends HttpRequestHandler {

    private static final Logger LOG = Logger.getInstance(ProfilerHttpRequestHandler.class);
    private final PluginFileManager fileManager = PluginFileManager.getInstance();

    public static void sendProto(ChannelHandlerContext context,
                                 @Nullable Message message) {
        if (message == null) {
            sendBytes(context, "application/octet-stream", new byte[0]);
            return;
        }
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            message.writeTo(outputStream);
            sendBytes(context, "application/octet-stream", outputStream.toByteArray());
        } catch (IOException e) {
            LOG.error(e);
        }
    }

    private static void sendBytes(ChannelHandlerContext context,
                                  String contentType,
                                  byte[] bytes) {
        FullHttpResponse response = new DefaultFullHttpResponse(
                HttpVersion.HTTP_1_1,
                HttpResponseStatus.OK,
                Unpooled.wrappedBuffer(bytes)
        );
        response.headers().set("Content-Type", contentType);
        ChannelFuture f = context.channel().writeAndFlush(response);
        f.addListener(ChannelFutureListener.CLOSE);
    }

    public static void sendStatus(HttpResponseStatus status, Channel channel) {
        DefaultFullHttpResponse response = new DefaultFullHttpResponse(HttpVersion.HTTP_1_1, status);
        HttpUtil.setContentLength(response, 0);
        Responses.addCommonHeaders(response);
        Responses.addNoCache(response);
        response.headers().set("X-Frame-Options", "Deny");
        Responses.send(response, channel, true);
    }

    @Nullable
    public static String getParameter(QueryStringDecoder urlDecoder, String key) {
        Map<String, java.util.List<String>> parameters = urlDecoder.parameters();
        if (parameters.containsKey(key)) {
            return parameters.get(key).get(0);
        }
        return null;
    }

    public static void sendJson(ChannelHandlerContext context, String json) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            outputStream.write(json.getBytes());
            sendBytes(context, "application/json", outputStream.toByteArray());
        } catch (IOException e) {
            LOG.error(e);
        }
    }

    @Nullable
    public static Filter getFilter(QueryStringDecoder urlDecoder) {
        if (urlDecoder.parameters().containsKey("include") || urlDecoder.parameters().containsKey("exclude")) {
            String includingConfigsString = getParameter(urlDecoder, "include");
            String excludingConfigsString = getParameter(urlDecoder, "exclude");
            return new Filter(includingConfigsString, excludingConfigsString);
        }
        return null;
    }

    private byte[] renderPage(String htmlFilePath,
                              @Nullable String fileName,
                              @NotNull String projectName,
                              @Nullable String include,
                              @Nullable String exclude) {
        htmlFilePath = fileManager.getStaticFilePath(htmlFilePath);
        String filterParameters = getFilterAsGetParameters(include, exclude);
        try (BufferedReader bufferedReader = new BufferedReader(new FileReader(new File(htmlFilePath)))) {
            return String.join("", bufferedReader.lines()
                    .map((line) -> {
                                String replacement = fileName == null ?
                                        "" :
                                        "file=" + fileName + "&";
                                return line.replace("{{ projectName }}", projectName)
                                        .replace("{{ fileParam }}", replacement)
                                        .replace("{{ filter }}", filterParameters);
                            }
                    )
                    .toArray(String[]::new)).getBytes();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private String getFilterAsGetParameters(@Nullable String include, @Nullable String exclude) {
        String res = "";
        if (include != null) {
            res += "&include=" + include;
        }
        if (exclude != null) {
            res += "&exclude=" + exclude;
        }
        return res;
    }

    private void sendFileList(ChannelHandlerContext context, String projectName) {
        sendJson(context, new Gson().toJson(fileManager.getFileNameList(projectName)));
    }

    private void sendListProjects(ChannelHandlerContext context) {
        String json = new Gson().toJson(
                fileManager.getProjectList()
        );
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            outputStream.write(json.getBytes());
            sendBytes(context, "application/json", outputStream.toByteArray());
        } catch (IOException e) {
            LOG.error(e);
        }
    }

    private void sendStatic(ChannelHandlerContext context,
                            String fileUri,
                            String contentType) throws IOException {
        LOG.info("Got filename: " + fileUri);
        String filePath = fileManager.getStaticFilePath(fileUri);
        LOG.info("This file will be sent: " + filePath);
        try (InputStream inputStream = new FileInputStream(new File(filePath))) {
            sendBytes(context, contentType, IOUtils.toByteArray(inputStream));
        }
    }

    private boolean processPostMethod(QueryStringDecoder urlDecoder, FullHttpRequest fullHttpRequest, ChannelHandlerContext context) {
        String uri = urlDecoder.path(); // without get parameters
        switch (uri) {
            case ServerNames.CONNECTION_ALIVE:
                sendStatus(HttpResponseStatus.OK, context.channel());
                return true;
            case ServerNames.UPLOAD_FILE:
                uploadFile(fullHttpRequest, context);
                return true;
            case ServerNames.DELETE_FILE:
            case ServerNames.UNDO_DELETE_FILE:
                manageDelete(fullHttpRequest, context, uri);
                return true;
        }
        return false;
    }

    private void manageDelete(FullHttpRequest fullHttpRequest,
                              ChannelHandlerContext context,
                              String uri) {
        String fileName = fullHttpRequest.headers().get("File-Name");
        String projectName = fullHttpRequest.headers().get("Project-Name");
        if (fileName == null || projectName == null) {
            return;
        }
        switch (uri) {
            case ServerNames.DELETE_FILE:
                LOG.info("Delete file: " + fileName + " project: " + projectName);
                fileManager.deleteFile(fileName, projectName);
                break;
            case ServerNames.UNDO_DELETE_FILE:
                LOG.info("Undo delete file: " + fileName + " project: " + projectName);
                fileManager.undoDeleteFile(fileName, projectName);
        }
        sendStatus(HttpResponseStatus.OK, context.channel());
    }

    private void uploadFile(FullHttpRequest fullHttpRequest,
                            ChannelHandlerContext context) {
        String fileName = fullHttpRequest.headers().get("File-Name");
        LOG.info("Got file: " + fileName);
        byte[] bytes = getBytes(fullHttpRequest.content());
        boolean isSaved;
        if (Objects.equals(ProfilerToFlamegraphConverter.Companion.getFileExtension(fileName), "ser")) {
            isSaved = fileManager.serFileSaver.save(bytes, fileName) != null;
        } else if (isFlamegraph(bytes)) {
            isSaved = fileManager.flamegraphFileSaver.save(bytes, fileName) != null;
        } else {
            isSaved = convertWithExtensions(fileName, bytes);
        }
        sendStatus(context.channel(), isSaved);
    }

    private void sendStatus(Channel channel, boolean isSaved) {
        if (isSaved) {
            sendStatus(HttpResponseStatus.OK, channel);
        } else {
            sendStatus(HttpResponseStatus.BAD_REQUEST, channel);
        }
    }

    private boolean convertWithExtensions(String fileName, byte[] bytes) {
        boolean isSaved = false;
        File file = fileManager.tempFileSaver.save(bytes, fileName);
        if (file != null) {
            Map<String, Integer> stacks = ProfilerToFlamegraphConverter.Companion.convert(file);
            if (stacks != null) {
                isSaved = fileManager.flamegraphFileSaver
                        .save(stacks, fileName) != null;
            }
            //noinspection ResultOfMethodCallIgnored
            file.delete();
        }
        return isSaved;
    }

    private byte[] getBytes(ByteBuf byteBuf) {
        byte[] bytes = new byte[byteBuf.readableBytes()];
        byteBuf.readBytes(bytes);
        return bytes;
    }

    @Override
    public boolean process(QueryStringDecoder urlDecoder,
                           FullHttpRequest fullHttpRequest,
                           ChannelHandlerContext context) {
        LOG.info(fullHttpRequest.method() + " Request: " + urlDecoder.uri());
        if (!urlDecoder.uri().startsWith(ServerNames.MAIN_NAME)) {
            return false;
        }
        TreeManager.getInstance().updateLastTime();
        if (fullHttpRequest.method() == HttpMethod.POST) {
            return processPostMethod(urlDecoder, fullHttpRequest, context);
        } else {
            return processGetMethod(urlDecoder, context);
        }
    }

    @Override
    public boolean isSupported(FullHttpRequest request) {
        return request.method() == HttpMethod.POST ||
                request.method() == HttpMethod.GET;
    }

    private boolean processGetMethod(QueryStringDecoder urlDecoder, ChannelHandlerContext context) {
        String uri = urlDecoder.path(); // without get parameters
        switch (uri) {
            case ServerNames.LIST_PROJECTS:
                LOG.info("list-projects");
                sendListProjects(context);
                return true;
            case ServerNames.FILE_LIST:
                LOG.info("file list");
                String project = getParameter(urlDecoder, "project");
                if (project != null) {
                    sendFileList(context, project);
                }
                return true;
            case ServerNames.HOT_SPOTS_JS_REQUEST:
                LOG.info("hot spots js request");
                new HotSpotsRequestHandler(urlDecoder, context).process();
                return true;
        }
        switch (uri) {
            case ServerNames.CALL_TREE_JS_REQUEST:
            case ServerNames.CALL_TREE_PREVIEW_JS_REQUEST:
                new CallTreeRequestHandler(urlDecoder, context).process();
                return true;
            case ServerNames.OUTGOING_CALLS_JS_REQUEST:
                new OutgoingCallsRequestHandler(urlDecoder, context).process();
                return true;
            case ServerNames.INCOMING_CALLS_JS_REQUEST:
                new IncomingCallsRequestHandler(urlDecoder, context).process();
                return true;
            case ServerNames.CALL_TREE_COUNT:
                new CallTreeMethodsCounter(urlDecoder, context).sendJson();
                return true;
            case ServerNames.OUTGOING_CALLS_COUNT:
                new AccumulativeTreesMethodCounter(urlDecoder, context, TreeType.OUTGOING_CALLS).sendJson();
                return true;
            case ServerNames.INCOMING_CALLS_COUNT:
                new AccumulativeTreesMethodCounter(urlDecoder, context, TreeType.INCOMING_CALLS).sendJson();
                return true;
        }
        switch (uri) {
            case ServerNames.CALL_TREE:
            case ServerNames.OUTGOING_CALLS:
            case ServerNames.INCOMING_CALLS:
            case ServerNames.HOT_SPOTS:
                processHtmlRequest(uri, context, urlDecoder);
                return true;
        }
        try {
            if (ServerNames.CSS_PATTERN.matcher(uri).matches()) {
                LOG.info("CSS");
                sendStatic(context, uri, "text/css");
            } else if (ServerNames.JS_PATTERN.matcher(uri).matches()) {
                LOG.info("JS");
                sendStatic(context, uri, "text/javascript");
            } else if (ServerNames.FONT_PATTERN.matcher(uri).matches()) {
                sendStatic(context, uri, "application/octet-stream");
            } else if (ServerNames.PNG_PATTERN.matcher(uri).matches()) {
                sendStatic(context, uri, "image/png");
            }
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    private void processHtmlRequest(String uri,
                                    ChannelHandlerContext context,
                                    QueryStringDecoder urlDecoder) {
        String projectName = getParameter(urlDecoder, "project");
        if (projectName == null) {
            projectName = "";
        }
        sendBytes(
                context,
                "text/html",
                renderPage(
                        uri + ".html",
                        getParameter(urlDecoder, "file"),
                        projectName,
                        getParameter(urlDecoder, "include"),
                        getParameter(urlDecoder, "exclude")
                )
        );
    }
}
