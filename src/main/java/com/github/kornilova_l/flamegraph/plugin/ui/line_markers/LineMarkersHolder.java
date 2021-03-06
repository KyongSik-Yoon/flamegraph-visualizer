package com.github.kornilova_l.flamegraph.plugin.ui.line_markers;

import com.github.kornilova_l.flamegraph.configuration.Configuration;
import com.github.kornilova_l.flamegraph.plugin.configuration.ConfigStorage;
import com.github.kornilova_l.flamegraph.plugin.configuration.PluginConfigManager;
import com.intellij.openapi.components.AbstractProjectComponent;
import com.intellij.openapi.editor.Document;
import com.intellij.openapi.editor.Editor;
import com.intellij.openapi.editor.EditorFactory;
import com.intellij.openapi.editor.ex.MarkupModelEx;
import com.intellij.openapi.editor.impl.DocumentMarkupModel;
import com.intellij.openapi.editor.markup.HighlighterTargetArea;
import com.intellij.openapi.editor.markup.RangeHighlighter;
import com.intellij.openapi.fileEditor.FileDocumentManager;
import com.intellij.openapi.progress.ProcessCanceledException;
import com.intellij.openapi.project.DumbService;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.vfs.VirtualFile;
import com.intellij.psi.PsiFile;
import com.intellij.psi.PsiMethod;
import com.intellij.psi.search.FilenameIndex;
import com.intellij.psi.search.GlobalSearchScope;
import com.intellij.xdebugger.ui.DebuggerColors;
import org.jetbrains.annotations.NotNull;

import java.util.HashMap;

public class LineMarkersHolder extends AbstractProjectComponent {
    private final HashMap<PsiMethod, RangeHighlighter> rangeHighlighters = new HashMap<>();
    private final Configuration configuration;

    protected LineMarkersHolder(Project project) {
        super(project);
        configuration = myProject.getComponent(ConfigStorage.class).getState();
    }

    public static MarkupModelEx getMarkupModel(Document document, Project project) {
        return (MarkupModelEx) DocumentMarkupModel.forDocument(document, project, true);
    }

    public void setIcon(PsiMethod psiMethod, MarkupModelEx markupModel) {
        removeIconIfPresent(psiMethod, markupModel);
        try {
            RangeHighlighter highlighter = markupModel.addRangeHighlighter(
                    psiMethod.getTextOffset(),
                    psiMethod.getTextOffset() + 1,
                    DebuggerColors.BREAKPOINT_HIGHLIGHTER_LAYER,
                    null,
                    HighlighterTargetArea.EXACT_RANGE);
            highlighter.setGutterIconRenderer(
                    new ProfilerGutterIconRenderer(
                            configuration.getIncludingConfigs(
                                    PluginConfigManager.newMethodConfig(psiMethod)
                            )
                    )
            );
            rangeHighlighters.put(psiMethod, highlighter);
        } catch (ProcessCanceledException | IllegalArgumentException exception) {
            /* IllegalArgumentException may be thrown by markupModel if ranges are outdated */
            exception.printStackTrace();
        }
    }

    public void removeIconIfPresent(PsiMethod method, MarkupModelEx markupModel) {
        RangeHighlighter highlighter = rangeHighlighters.get(method);
        if (highlighter != null) {
            markupModel.removeHighlighter(highlighter);
            rangeHighlighters.remove(method);
        }
    }

    private void updateMethodMarker(@NotNull PsiFile psiFile, @NotNull Document document) {
        DumbService.getInstance(myProject).runWhenSmart(() ->
                new UpdatingPsiElementVisitor(myProject, getMarkupModel(document, myProject))
                        .visitElement(psiFile));
    }

    void updateMethodMarker(PsiMethod psiMethod, MarkupModelEx markupModel) {
        DumbService.getInstance(myProject).runWhenSmart(() -> {
            if (configuration.isMethodInstrumented(PluginConfigManager.newMethodConfig(psiMethod))) {
                setIcon(psiMethod, markupModel);
            } else {
                removeIconIfPresent(psiMethod, markupModel);
            }
        });
    }

    void updateMethodMarker(@NotNull VirtualFile file) {
        DumbService.getInstance(myProject).runWhenSmart(() -> {
            PsiFile[] psiFiles = FilenameIndex.getFilesByName(
                    myProject,
                    file.getName(),
                    GlobalSearchScope.fileScope(myProject, file));
            if (psiFiles.length != 1) {
                return;
            }
            PsiFile psiFile = psiFiles[0];
            Document document = psiFile.getViewProvider().getDocument();
            if (document == null) {
                return;
            }
            updateMethodMarker(psiFile, document);
        });
    }


    public void updateOpenedDocuments() {
        for (Editor editor : EditorFactory.getInstance().getAllEditors()) {
            if (editor.getProject() != myProject) {
                continue;
            }
            Document document = editor.getDocument();
            VirtualFile virtualFile = FileDocumentManager.getInstance().getFile(document);
            if (virtualFile != null) {
                updateMethodMarker(virtualFile);
            }
        }
    }
}
