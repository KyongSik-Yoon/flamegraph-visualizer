/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var com_github_kornilova_l_flamegraph_proto_event_pb = require('./event_pb.js');
goog.exportSymbol('proto.com.github.kornilova_l.flamegraph.proto.Tree', null, global);
goog.exportSymbol('proto.com.github.kornilova_l.flamegraph.proto.Tree.Node', null, global);
goog.exportSymbol('proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo', null, global);
goog.exportSymbol('proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.com.github.kornilova_l.flamegraph.proto.Tree, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.com.github.kornilova_l.flamegraph.proto.Tree.displayName = 'proto.com.github.kornilova_l.flamegraph.proto.Tree';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.prototype.toObject = function(opt_includeInstance) {
  return proto.com.github.kornilova_l.flamegraph.proto.Tree.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.com.github.kornilova_l.flamegraph.proto.Tree} msg The msg instance to transform.
 * @return {!Object}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.toObject = function(includeInstance, msg) {
  var f, obj = {
    treeInfo: (f = msg.getTreeInfo()) && proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo.toObject(includeInstance, f),
    baseNode: (f = msg.getBaseNode()) && proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.toObject(includeInstance, f),
    depth: jspb.Message.getFieldWithDefault(msg, 3, 0),
    width: jspb.Message.getFieldWithDefault(msg, 4, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.com.github.kornilova_l.flamegraph.proto.Tree}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.com.github.kornilova_l.flamegraph.proto.Tree;
  return proto.com.github.kornilova_l.flamegraph.proto.Tree.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.com.github.kornilova_l.flamegraph.proto.Tree} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.com.github.kornilova_l.flamegraph.proto.Tree}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo;
      reader.readMessage(value,proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo.deserializeBinaryFromReader);
      msg.setTreeInfo(value);
      break;
    case 2:
      var value = new proto.com.github.kornilova_l.flamegraph.proto.Tree.Node;
      reader.readMessage(value,proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.deserializeBinaryFromReader);
      msg.setBaseNode(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setDepth(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setWidth(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.com.github.kornilova_l.flamegraph.proto.Tree.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.com.github.kornilova_l.flamegraph.proto.Tree} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTreeInfo();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo.serializeBinaryToWriter
    );
  }
  f = message.getBaseNode();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.serializeBinaryToWriter
    );
  }
  f = message.getDepth();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
  f = message.getWidth();
  if (f !== 0) {
    writer.writeInt64(
      4,
      f
    );
  }
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.repeatedFields_, null);
};
goog.inherits(proto.com.github.kornilova_l.flamegraph.proto.Tree.Node, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.displayName = 'proto.com.github.kornilova_l.flamegraph.proto.Tree.Node';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.repeatedFields_ = [4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.prototype.toObject = function(opt_includeInstance) {
  return proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.com.github.kornilova_l.flamegraph.proto.Tree.Node} msg The msg instance to transform.
 * @return {!Object}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.toObject = function(includeInstance, msg) {
  var f, obj = {
    offset: jspb.Message.getFieldWithDefault(msg, 1, 0),
    width: jspb.Message.getFieldWithDefault(msg, 2, 0),
    nodeInfo: (f = msg.getNodeInfo()) && proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.toObject(includeInstance, f),
    nodesList: jspb.Message.toObjectList(msg.getNodesList(),
    proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.com.github.kornilova_l.flamegraph.proto.Tree.Node}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.com.github.kornilova_l.flamegraph.proto.Tree.Node;
  return proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.com.github.kornilova_l.flamegraph.proto.Tree.Node} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.com.github.kornilova_l.flamegraph.proto.Tree.Node}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setOffset(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setWidth(value);
      break;
    case 3:
      var value = new proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo;
      reader.readMessage(value,proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.deserializeBinaryFromReader);
      msg.setNodeInfo(value);
      break;
    case 4:
      var value = new proto.com.github.kornilova_l.flamegraph.proto.Tree.Node;
      reader.readMessage(value,proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.deserializeBinaryFromReader);
      msg.addNodes(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.com.github.kornilova_l.flamegraph.proto.Tree.Node} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOffset();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = message.getWidth();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = message.getNodeInfo();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.serializeBinaryToWriter
    );
  }
  f = message.getNodesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.serializeBinaryToWriter
    );
  }
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.repeatedFields_, proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.oneofGroups_);
};
goog.inherits(proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.displayName = 'proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.repeatedFields_ = [4];

/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.oneofGroups_ = [[5,6]];

/**
 * @enum {number}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.ResultCase = {
  RESULT_NOT_SET: 0,
  RETURN_VALUE: 5,
  EXCEPTION: 6
};

/**
 * @return {proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.ResultCase}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.getResultCase = function() {
  return /** @type {proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.ResultCase} */(jspb.Message.computeOneofCase(this, proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo} msg The msg instance to transform.
 * @return {!Object}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    methodName: jspb.Message.getFieldWithDefault(msg, 1, ""),
    className: jspb.Message.getFieldWithDefault(msg, 2, ""),
    description: jspb.Message.getFieldWithDefault(msg, 7, ""),
    isStatic: jspb.Message.getFieldWithDefault(msg, 3, false),
    count: jspb.Message.getFieldWithDefault(msg, 8, 0),
    parametersList: jspb.Message.toObjectList(msg.getParametersList(),
    com_github_kornilova_l_flamegraph_proto_event_pb.Var.toObject, includeInstance),
    returnValue: (f = msg.getReturnValue()) && com_github_kornilova_l_flamegraph_proto_event_pb.Var.toObject(includeInstance, f),
    exception: (f = msg.getException()) && com_github_kornilova_l_flamegraph_proto_event_pb.Var.Object.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo;
  return proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setMethodName(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setClassName(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setDescription(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsStatic(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setCount(value);
      break;
    case 4:
      var value = new com_github_kornilova_l_flamegraph_proto_event_pb.Var;
      reader.readMessage(value,com_github_kornilova_l_flamegraph_proto_event_pb.Var.deserializeBinaryFromReader);
      msg.addParameters(value);
      break;
    case 5:
      var value = new com_github_kornilova_l_flamegraph_proto_event_pb.Var;
      reader.readMessage(value,com_github_kornilova_l_flamegraph_proto_event_pb.Var.deserializeBinaryFromReader);
      msg.setReturnValue(value);
      break;
    case 6:
      var value = new com_github_kornilova_l_flamegraph_proto_event_pb.Var.Object;
      reader.readMessage(value,com_github_kornilova_l_flamegraph_proto_event_pb.Var.Object.deserializeBinaryFromReader);
      msg.setException(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMethodName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getClassName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getDescription();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
  f = message.getIsStatic();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
  f = message.getCount();
  if (f !== 0) {
    writer.writeInt32(
      8,
      f
    );
  }
  f = message.getParametersList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      com_github_kornilova_l_flamegraph_proto_event_pb.Var.serializeBinaryToWriter
    );
  }
  f = message.getReturnValue();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      com_github_kornilova_l_flamegraph_proto_event_pb.Var.serializeBinaryToWriter
    );
  }
  f = message.getException();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      com_github_kornilova_l_flamegraph_proto_event_pb.Var.Object.serializeBinaryToWriter
    );
  }
};


/**
 * optional string method_name = 1;
 * @return {string}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.getMethodName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.setMethodName = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string class_name = 2;
 * @return {string}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.getClassName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.setClassName = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string description = 7;
 * @return {string}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.getDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/** @param {string} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.setDescription = function(value) {
  jspb.Message.setField(this, 7, value);
};


/**
 * optional bool is_static = 3;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.getIsStatic = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 3, false));
};


/** @param {boolean} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.setIsStatic = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional int32 count = 8;
 * @return {number}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.getCount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/** @param {number} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.setCount = function(value) {
  jspb.Message.setField(this, 8, value);
};


/**
 * repeated Var parameters = 4;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.com.github.kornilova_l.flamegraph.proto.Var>}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.getParametersList = function() {
  return /** @type{!Array.<!proto.com.github.kornilova_l.flamegraph.proto.Var>} */ (
    jspb.Message.getRepeatedWrapperField(this, com_github_kornilova_l_flamegraph_proto_event_pb.Var, 4));
};


/** @param {!Array.<!proto.com.github.kornilova_l.flamegraph.proto.Var>} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.setParametersList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 4, value);
};


/**
 * @param {!proto.com.github.kornilova_l.flamegraph.proto.Var=} opt_value
 * @param {number=} opt_index
 * @return {!proto.com.github.kornilova_l.flamegraph.proto.Var}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.addParameters = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 4, opt_value, proto.com.github.kornilova_l.flamegraph.proto.Var, opt_index);
};


proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.clearParametersList = function() {
  this.setParametersList([]);
};


/**
 * optional Var return_value = 5;
 * @return {?proto.com.github.kornilova_l.flamegraph.proto.Var}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.getReturnValue = function() {
  return /** @type{?proto.com.github.kornilova_l.flamegraph.proto.Var} */ (
    jspb.Message.getWrapperField(this, com_github_kornilova_l_flamegraph_proto_event_pb.Var, 5));
};


/** @param {?proto.com.github.kornilova_l.flamegraph.proto.Var|undefined} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.setReturnValue = function(value) {
  jspb.Message.setOneofWrapperField(this, 5, proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.oneofGroups_[0], value);
};


proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.clearReturnValue = function() {
  this.setReturnValue(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.hasReturnValue = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional Var.Object exception = 6;
 * @return {?proto.com.github.kornilova_l.flamegraph.proto.Var.Object}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.getException = function() {
  return /** @type{?proto.com.github.kornilova_l.flamegraph.proto.Var.Object} */ (
    jspb.Message.getWrapperField(this, com_github_kornilova_l_flamegraph_proto_event_pb.Var.Object, 6));
};


/** @param {?proto.com.github.kornilova_l.flamegraph.proto.Var.Object|undefined} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.setException = function(value) {
  jspb.Message.setOneofWrapperField(this, 6, proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.oneofGroups_[0], value);
};


proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.clearException = function() {
  this.setException(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo.prototype.hasException = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional int64 offset = 1;
 * @return {number}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.prototype.getOffset = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.prototype.setOffset = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int64 width = 2;
 * @return {number}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.prototype.getWidth = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.prototype.setWidth = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional NodeInfo node_info = 3;
 * @return {?proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.prototype.getNodeInfo = function() {
  return /** @type{?proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo} */ (
    jspb.Message.getWrapperField(this, proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo, 3));
};


/** @param {?proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.NodeInfo|undefined} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.prototype.setNodeInfo = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.prototype.clearNodeInfo = function() {
  this.setNodeInfo(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.prototype.hasNodeInfo = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * repeated Node nodes = 4;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.com.github.kornilova_l.flamegraph.proto.Tree.Node>}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.prototype.getNodesList = function() {
  return /** @type{!Array.<!proto.com.github.kornilova_l.flamegraph.proto.Tree.Node>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.com.github.kornilova_l.flamegraph.proto.Tree.Node, 4));
};


/** @param {!Array.<!proto.com.github.kornilova_l.flamegraph.proto.Tree.Node>} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.prototype.setNodesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 4, value);
};


/**
 * @param {!proto.com.github.kornilova_l.flamegraph.proto.Tree.Node=} opt_value
 * @param {number=} opt_index
 * @return {!proto.com.github.kornilova_l.flamegraph.proto.Tree.Node}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.prototype.addNodes = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 4, opt_value, proto.com.github.kornilova_l.flamegraph.proto.Tree.Node, opt_index);
};


proto.com.github.kornilova_l.flamegraph.proto.Tree.Node.prototype.clearNodesList = function() {
  this.setNodesList([]);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo.displayName = 'proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo} msg The msg instance to transform.
 * @return {!Object}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    startTime: jspb.Message.getFieldWithDefault(msg, 2, 0),
    threadName: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo;
  return proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setStartTime(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setThreadName(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStartTime();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = message.getThreadName();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional int64 start_time = 2;
 * @return {number}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo.prototype.getStartTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo.prototype.setStartTime = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string thread_name = 4;
 * @return {string}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo.prototype.getThreadName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo.prototype.setThreadName = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional TreeInfo tree_info = 1;
 * @return {?proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.prototype.getTreeInfo = function() {
  return /** @type{?proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo} */ (
    jspb.Message.getWrapperField(this, proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo, 1));
};


/** @param {?proto.com.github.kornilova_l.flamegraph.proto.Tree.TreeInfo|undefined} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.prototype.setTreeInfo = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.com.github.kornilova_l.flamegraph.proto.Tree.prototype.clearTreeInfo = function() {
  this.setTreeInfo(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.prototype.hasTreeInfo = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional Node base_node = 2;
 * @return {?proto.com.github.kornilova_l.flamegraph.proto.Tree.Node}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.prototype.getBaseNode = function() {
  return /** @type{?proto.com.github.kornilova_l.flamegraph.proto.Tree.Node} */ (
    jspb.Message.getWrapperField(this, proto.com.github.kornilova_l.flamegraph.proto.Tree.Node, 2));
};


/** @param {?proto.com.github.kornilova_l.flamegraph.proto.Tree.Node|undefined} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.prototype.setBaseNode = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.com.github.kornilova_l.flamegraph.proto.Tree.prototype.clearBaseNode = function() {
  this.setBaseNode(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.prototype.hasBaseNode = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional uint32 depth = 3;
 * @return {number}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.prototype.getDepth = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.prototype.setDepth = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional int64 width = 4;
 * @return {number}
 */
proto.com.github.kornilova_l.flamegraph.proto.Tree.prototype.getWidth = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/** @param {number} value */
proto.com.github.kornilova_l.flamegraph.proto.Tree.prototype.setWidth = function(value) {
  jspb.Message.setField(this, 4, value);
};


goog.object.extend(exports, proto.com.github.kornilova_l.flamegraph.proto);
