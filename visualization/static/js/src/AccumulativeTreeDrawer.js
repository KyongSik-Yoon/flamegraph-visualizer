const LAYER_HEIGHT = 19;
const LAYER_GAP = 1;
const POPUP_MARGIN = 6; // have no idea why there is a gap between popup and canvas
const ZOOMED_PARENT_COLOR = "#94bcff";
const RESET_ZOOM_BUTTON_COLOR = "#9da1ff";
const HIGHLIGHT_NOT_SET_COLOR = "#d1d1d1";
const CANVAS_PADDING = 35;

/**
 * Draws tree without:
 * - parameters
 * - start time
 */
class AccumulativeTreeDrawer {
    constructor(tree) {
        this.tree = tree;
        this.treeWidth = this.tree.getWidth();
        this.currentCanvasWidth = 0;
        this.canvasHeight = (LAYER_HEIGHT + LAYER_GAP) * (this.tree.getDepth() + 1);
        this.$section = null;
        this.stage = null;
        this.zoomedStage = null;
        this.className = "";
        this.methodName = "";
        this.returnValue = "";
        this.timePercent = 0;
        this.parameters = [];
        this.zoomedNode = null;
        this.$fileMenu = $(".file-menu");
        this.baseNode = this.tree.getBaseNode();
        this.isFull = this.baseNode.getNodesList()[0].getNodeInfo().getClassName() !== "";
        this.packageList = {}; // map package name to color
        this._buildPackageListRecursively(this.baseNode);
        this._setPackageColorsRecursively();
        this.baseNode.depth = 0;
        this.$popup = null;
        this.$canvasWrapper = null;
        this.$popupParameters = null;
        this.$popupIcon = null;
        this.canvasOffset = 0;
        this.enableZoom = true;
        this.nodesCount = -1;
        // for search:
        this.isHighlightedFunction = null;
        this.currentlyShownNodes = [];
        this.baseNode.fillCommand = {};
        this.wasMainStageHighlighted = false;
    }

    /**
     * @param node
     * @public
     */
    _countNodesRecursively(node) {
        this.nodesCount++;
        const children = node.getNodesList();
        for (let i = 0; i < children.length; i++) {
            this._countNodesRecursively(children[i]);
        }
    }

    /**
     * @param {String} className
     * @param {String} methodName
     * @param {String} desc
     * @param {Number} timePercent
     */
    setHeader(className, methodName, desc, timePercent) {
        this.className = className;
        this.methodName = methodName;
        this.returnValue = AccumulativeTreeDrawer._getReturnValue(desc);
        this.parameters = AccumulativeTreeDrawer._getParameters(desc);
        this.timePercent = timePercent;
    }

    draw() {
        console.log("start drawing");
        this._prepareDraw();
        const startTime = new Date().getTime();
        this.$section = this._createSection();
        this._createCanvas();

        this._createPopup(); // one for all nodes

        const childNodes = this.baseNode.getNodesList();
        if (childNodes.length === 0) {
            return;
        }
        this._drawFullTree();
        console.log("Drawing took " + (new Date().getTime() - startTime));
        this._enableResizeZoomedCanvas();
    };

    /**
     * @protected
     */
    _prepareDraw() {
        this._assignParentsAndDepthRecursively(this.baseNode, 0);
        this._setOriginalColorRecursively(this.baseNode);
        this._enableSearch();
    }

    /**
     * Get canvas Y coordinate (it start from top)
     * @param y
     * @returns {number}
     * @protected
     */
    flipY(y) {
        return this.canvasHeight - y - LAYER_HEIGHT;
    };

    _createSection() {
        const sectionContent = templates.tree.getAccumulativeTreeSection(
            {
                className: this.className,
                methodName: this.methodName,
                returnValue: this.returnValue,
                parameters: this.parameters,
                timePercent: this.timePercent
            }
        ).content;
        return $(sectionContent).appendTo($("main"));
    };

    /**
     * @param node
     * @param {String} color
     * @param {Number} scaleX
     * @param {Number} offsetX
     * @param {Boolean} isMostFirst
     * @param {createjs.Stage} stage
     * @param {number} zoomedNodeDepth
     * @private
     */
    _drawNode(node, color, scaleX, offsetX, isMostFirst, stage, zoomedNodeDepth) {
        const shape = this._drawRectangle(node, color, scaleX, offsetX, isMostFirst, stage);
        if (scaleX * this.currentCanvasWidth > 4 || node.depth - zoomedNodeDepth <= 1) {
            this.listenScale(node, shape);
            this._addShowPopupEvent(shape, offsetX + this.canvasOffset, node.depth, node);
            this._drawLabel(AccumulativeTreeDrawer._getLabelText(node), shape, scaleX, offsetX, node.depth, stage);
        }
    }

    /**
     * @param node
     * @param {String} color
     * @param {Number} scaleX
     * @param {Number} offsetX
     * @param {Boolean} isMostFirst
     * @param {createjs.Stage} stage
     * @return {createjs.Shape}
     * @private
     */
    _drawRectangle(node, color, scaleX, offsetX, isMostFirst, stage) {
        const shape = new createjs.Shape();
        if (stage === this.stage) {
            node.fillCommand = shape.graphics.beginFill(color).command;
        } else {
            node.zoomedFillCommand = shape.graphics.beginFill(color).command;
        }
        shape.graphics.drawRect(0, 0, this.currentCanvasWidth, LAYER_HEIGHT);
        const offsetY = this.flipY(AccumulativeTreeDrawer._calcNormaOffsetY(node.depth));
        const pixSizeX = Math.floor(scaleX * this.currentCanvasWidth);
        if (!isMostFirst) {
            offsetX = offsetX + 1;
        }
        if (!(pixSizeX < 2 || isMostFirst)) {
            scaleX = (pixSizeX - 1) / this.currentCanvasWidth;
        }
        if (pixSizeX <= 2) {
            scaleX = 1 / this.currentCanvasWidth;
        }
        if (pixSizeX === 0) {
            offsetX = offsetX - 1;
        }
        shape.setTransform(offsetX, offsetY, scaleX);
        //noinspection JSUnresolvedFunction
        stage.addChild(shape);
        return shape;
    }

    /**
     * @param node
     * @param {createjs.Shape} shape
     */
    listenScale(node, shape) {
        if (this.enableZoom) {
            //noinspection JSUnresolvedFunction
            shape.addEventListener("click", () => {
                this._changeZoom(node);
            })
        }
    }

    _countOffsetXForNode(node) {
        return (node.getOffset() / this.treeWidth) * this.currentCanvasWidth;
    }

    _countScaleXForNode(node) {
        return node.getWidth() / this.treeWidth;
    }

    _createPopup() {
        const popupContent = templates.tree.accumulativeTreePopup({
            isFull: this.isFull
        }).content;
        this.$canvasWrapper = this.$section.find(".canvas-wrapper");
        this.$popup = $(popupContent).appendTo(this.$canvasWrapper);
        this.$popupParameters = this.$popup.find(".parameters");
        this.$popupIcon = this.$popup.find(".parameter-icon");
    }

    /**
     * @param {String} labelText
     * @param {createjs.Shape} shape
     * @param scaleX
     * @param offsetX
     * @param {Number} nodeDepth
     * @param {createjs.Stage} stage
     * @return {createjs.Text}
     * @private
     */
    _drawLabel(labelText, shape, scaleX, offsetX, nodeDepth, stage) {
        const text = new createjs.Text(
            labelText,
            (LAYER_HEIGHT - 2) + "px Arial",
            "#fff"
        );
        text.x = offsetX + 2;
        text.y = this.flipY(nodeDepth * (LAYER_GAP + LAYER_HEIGHT));
        this._setTextMask(text, shape, scaleX);
        // noinspection JSUnresolvedFunction
        stage.setChildIndex(text, this.stage.getNumChildren() - 1);
        // noinspection JSUnresolvedFunction
        stage.addChild(text);
        return text;
    }

    /**
     * @param {Number} offsetX
     * @param {Number} depth
     */
    _setPopupPosition(offsetX, depth) {
        this.$popup
            .css("left", offsetX)
            .css("margin-top", -AccumulativeTreeDrawer._calcNormaOffsetY(depth) - POPUP_MARGIN + 2)
    }

    static _calcNormaOffsetY(depth) {
        return depth * (LAYER_GAP + LAYER_HEIGHT);
    }

    /**
     * @param {createjs.Shape} shape
     * @param {Number} offsetX
     * @param {Number} depth
     * @param node
     * @private
     */
    _addShowPopupEvent(shape, offsetX, depth, node) {
        let isPopupHovered = false;
        let isMethodHovered = false;
        this.$popup.hover(
            () => {
                isPopupHovered = true;
            },
            () => {
                isPopupHovered = false;
                if (!isMethodHovered) {
                    this.$popup.hide();
                }
            });
        // noinspection JSUnresolvedFunction
        shape.addEventListener("mouseover", () => {
            isMethodHovered = true;
            this._setPopupContent(node);
            this._setPopupPosition(this._shiftIfHidden(offsetX), depth);
            this.$popup.show();
        });
        // noinspection JSUnresolvedFunction
        shape.addEventListener("mouseout", () => {
            isMethodHovered = false;
            if (!isPopupHovered) {
                this.$popup.hide();
            }
        });
    }

    _enableSearch() {
        const input = $("#search-method-form").find("input");
        const simpleSearchPattern = new RegExp("[a-z\.]+");
        input.on('change keyup copy paste cut', common.updateRareDecorator(500, () => {
            const val = input.val();
            if (!val) {
                this.isHighlightedFunction = null;
                this._resetHighlight();
            } else {
                const lowercaseVal = val.toLowerCase();
                if (simpleSearchPattern.test(lowercaseVal)) {
                    this.isHighlightedFunction = (testString) => {
                        return testString.indexOf(lowercaseVal) !== -1;
                    };
                } else {
                    const pattern = new RegExp(".*" + common.escapeRegExp(lowercaseVal).split("*").join(".*") + ".*");
                    this.isHighlightedFunction = (testString) => {
                        return pattern.test(testString);
                    };
                }
                if (this.currentlyShownNodes.length === 0) {
                    this._setHighlightOnMainStage();
                } else {
                    this._setHighlightOnZoomedStage();
                }
            }
        }));
    }

    /**
     * @param node
     * @private
     */
    static _resetHighlightRecursively(node) {
        if (node.fillCommand !== undefined) {
            node.fillCommand.style = node.originalColor;
        }
        const children = node.getNodesList();
        for (let i = 0; i < children.length; i++) {
            AccumulativeTreeDrawer._resetHighlightRecursively(children[i]);
        }
    }

    _setTextMask(text, shape, scaleX) {
        const newShape = shape.clone();
        const nodeWidth = scaleX * this.currentCanvasWidth;
        newShape.scaleX = (nodeWidth - 4) / this.currentCanvasWidth;
        text.mask = newShape;
    }

    /**
     * @param node
     * @param {Number} depth
     */
    _assignParentsAndDepthRecursively(node, depth) {
        const children = node.getNodesList();
        node.normalizedName = this._getNormalizedName(node);
        node.depth = depth;
        for (let i = 0; i < children.length; i++) {
            children[i].parent = node;
            this._assignParentsAndDepthRecursively(children[i], depth + 1);
        }
    }

    _expandParents(node) {
        let parent = node.parent;
        while (parent !== this.baseNode) {
            this._drawNode(parent, ZOOMED_PARENT_COLOR, 1, 0, true, this.zoomedStage, node.depth);
            parent = parent.parent;
        }
    }

    _changeZoom(node) {
        this.currentlyShownNodes = [];
        if (node !== this.baseNode) {
            this._setNodeZoomed(node);
        } else { // if reset zoom
            this._resetZoom();
        }
    }

    /**
     * @param node this node will be drawn
     * @param {Number} drawnLayerCount
     * @param {Number} newFullScaleX
     * @param {Number} newOffsetX
     * @param {Boolean} isMostFirst
     * @param {createjs.Stage} stage
     * @param {Boolean} saveNodesToList
     * @param {Boolean} saveOriginalColor
     * @param {number} zoomedNodeDepth
     * @private
     * @return {Number} max depth
     */
    _drawNodesRecursively(node,
                          drawnLayerCount,
                          newFullScaleX,
                          newOffsetX,
                          isMostFirst,
                          stage,
                          saveNodesToList,
                          saveOriginalColor,
                          zoomedNodeDepth) {
        if (saveNodesToList) {
            this.currentlyShownNodes.push(node);
        }
        this._drawNode(
            node,
            node.originalColor,
            this._countScaleXForNode(node) / newFullScaleX,
            (this._countOffsetXForNode(node) - newOffsetX) / newFullScaleX,
            isMostFirst,
            stage,
            zoomedNodeDepth
        );
        const children = node.getNodesList();
        for (let i = 0; i < children.length; i++) {
            this._drawNodesRecursively(
                children[i],
                drawnLayerCount + 1,
                newFullScaleX,
                newOffsetX,
                i === 0 && isMostFirst,
                stage,
                saveNodesToList,
                saveOriginalColor,
                zoomedNodeDepth
            );
        }
    }

    _addResetButton() {
        const shape = this._drawRectangle(this.baseNode, RESET_ZOOM_BUTTON_COLOR, 1, 0, true, this.zoomedStage);
        this.listenScale(this.baseNode, shape);
        this._drawLabel("Reset zoom", shape, 1, 0, 0, this.zoomedStage);
    }

    /**
     * @param node not a baseNode
     * @return {String}
     * @private
     */
    static _getLabelText(node) {
        return node.getNodeInfo().getMethodName();
    }

    _drawFullTree() {
        this.currentCanvasWidth = AccumulativeTreeDrawer._getCanvasWidth(this.$section.find(".original-canvas"));
        const children = this.baseNode.getNodesList();
        for (let i = 0; i < children.length; i++) {
            this._drawNodesRecursively(
                children[i],
                0,
                1,
                0,
                true,
                this.stage,
                false,
                true,
                0
            );
        }
        this.stage.update();
    }

    /**
     * @param node
     * @protected
     */
    _setPopupContent(node) {
        this.$popup.find(".class-name").text(node.getNodeInfo().getClassName());
        this.$popup.find("h3").text(node.getNodeInfo().getMethodName());
        const desc = encodeURIComponent(node.getNodeInfo().getDescription());
        this.$popup.find(".outgoing-link").attr("href",
            `/flamegraph-profiler/outgoing-calls?` + AccumulativeTreeDrawer.getGETParameters(node, desc)
        );
        this.$popup.find(".incoming-link").attr("href",
            `/flamegraph-profiler/incoming-calls?` + AccumulativeTreeDrawer.getGETParameters(node, desc)
        );
        this._setParameters(node);
        this._setPopupReturnValue(node);
    }

    static getGETParameters(node, desc) {
        const className = node.getNodeInfo().getClassName();
        return `file=${constants.fileName}&` +
            `project=${constants.projectName}&` +
            `method=${node.getNodeInfo().getMethodName()}` +
            (className ? "&class=" + className + "&" : "") +
            (desc ? `&desc=${desc}&` : "") +
            (desc ? `&isStatic=${node.getNodeInfo().getIsStatic() === true ? "true" : "false"}` : "");
    }

    /**
     * @param {String} fullDescription
     * @return {null|Array<String>}
     */
    static getParametersTypesList(fullDescription) {
        const parameters = fullDescription.substring(fullDescription.indexOf("(") + 1, fullDescription.lastIndexOf(")"));
        if (parameters === "") {
            return null;
        }
        return parameters.split(", ");
    }

    /**
     * @param node
     */
    _setParameters(node) {
        const parametersList = AccumulativeTreeDrawer.getParametersTypesList(node.getNodeInfo().getDescription());
        this.$popupParameters.find("*").remove();
        if (parametersList !== null) {
            for (let i = 0; i < parametersList.length; i++) {
                this.$popupParameters.append($("<p>" + parametersList[i] + "</p>"))
            }
            this.$popup.find();
            this.$popupIcon.show();
        } else {
            this.$popupIcon.hide();
        }
    }

    /**
     * @param node
     * @param {RegExp} pattern string in lowercase
     * @private
     */
    _updateHighlightRecursively(node, pattern) {
        if (this.isHighlightedFunction(node.normalizedName)) {
            AccumulativeTreeDrawer._setHighlight(node, true, true);
        } else {
            AccumulativeTreeDrawer._setHighlight(node, false, true);
        }
        const children = node.getNodesList();
        for (let i = 0; i < children.length; i++) {
            this._updateHighlightRecursively(children[i], pattern);
        }
    }

    /**
     * @param {Array} currentlyShownNodes
     * @private
     */
    _updateHighlight(currentlyShownNodes) {
        for (let i = 0; i < currentlyShownNodes.length; i++) {
            if (this.isHighlightedFunction(currentlyShownNodes[i].normalizedName)) {
                AccumulativeTreeDrawer._setHighlight(currentlyShownNodes[i], true, false);
            } else {
                AccumulativeTreeDrawer._setHighlight(currentlyShownNodes[i], false, false);
            }
        }
    }

    /**
     * @param node
     * @param {Boolean} isHighlightSet
     * @param {Boolean} isMainStage
     * @private
     */
    static _setHighlight(node, isHighlightSet, isMainStage) {
        if (isMainStage) {
            node.fillCommand.style = isHighlightSet ? node.originalColor : HIGHLIGHT_NOT_SET_COLOR;
        } else {
            node.zoomedFillCommand.style = isHighlightSet ? node.originalColor : HIGHLIGHT_NOT_SET_COLOR;
        }
    }

    static _resetHighlightList(currentlyShownNodes) {
        for (let i = 0; i < currentlyShownNodes.length; i++) {
            AccumulativeTreeDrawer._setHighlight(currentlyShownNodes[i], true, false);
        }
    }

    /**
     * @private
     */
    _resetHighlight() {
        if (this.currentlyShownNodes.length === 0) { // if not zoomed
            this.wasMainStageHighlighted = false;
            AccumulativeTreeDrawer._resetHighlightRecursively(this.baseNode);
            this.stage.update();
        } else { // if zoomed
            AccumulativeTreeDrawer._resetHighlightList(this.currentlyShownNodes);
            this.zoomedStage.update();
        }
    }

    /**
     * @private
     */
    _setHighlightOnMainStage() {
        this.wasMainStageHighlighted = true;
        this._updateHighlightRecursively(this.baseNode);
        this.stage.update();
    }

    /**
     * @private
     */
    _setHighlightOnZoomedStage() {
        this._updateHighlight(this.currentlyShownNodes);
        this.zoomedStage.update();
    }

    _setOriginalColorRecursively(node) {
        node.originalColor = this._getOriginalColor(node);
        const children = node.getNodesList();
        for (let i = 0; i < children.length; i++) {
            this._setOriginalColorRecursively(children[i]);
        }
    }

    _buildPackageListRecursively(node) {
        const children = node.getNodesList();
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            this._addPackage(AccumulativeTreeDrawer._getPackageName(child));
            this._buildPackageListRecursively(child);
        }
    }

    /**
     * @param {String} packageName
     * @private
     */
    _addPackage(packageName) {
        if (this.packageList[packageName] === undefined) {
            this.packageList[packageName] = 0;
        }
    }

    _setPackageColorsRecursively() {
        const packages = Object.keys(this.packageList);
        packages.sort();
        const step = 1 / packages.length;
        if (packages.length === 1) {
            this.packageList[packages[0]] = 0.5;
            return;
        }
        for (let i = 0; i < packages.length; i++) {
            this.packageList[packages[i]] = i * step;
        }
    }

    /**
     * @param node
     * @return {String}
     */
    static _getPackageName(node) {
        if (node.getNodeInfo() === undefined) {
            return "";
        }
        const className = node.getNodeInfo().getClassName();
        const lastDot = className.lastIndexOf(".");
        if (lastDot !== -1) {
            return className.substring(0, lastDot);
        } else {
            return ""
        }
    }

    _setPopupReturnValue(node) {

    }

    _resetZoom() {
        this.zoomedNode = null;
        if (this.isHighlightedFunction !== null) {
            this._setHighlightOnMainStage();
        } else if (this.wasMainStageHighlighted) {
            this._resetHighlight();
        }
        $("#" + this.zoomedStage.id).removeClass("canvas-zoomed-show");
        $("#" + this.stage.id).removeClass("original-canvas-zoomed");
    }

    _setNodeZoomed(node) {
        this.zoomedNode = node;
        this.currentCanvasWidth = AccumulativeTreeDrawer._getCanvasWidth(this.$section.find(".canvas-zoomed"));
        common.showLoader(constants.loaderMessages.drawing, () => {
            this.zoomedStage.removeAllChildren();
            this._expandParents(node);
            this._drawNodesRecursively(
                node,
                0,
                this._countScaleXForNode(node),
                this._countOffsetXForNode(node),
                true,
                this.zoomedStage,
                true,
                false,
                node.depth
            );
            this._addResetButton();
            if (this.isHighlightedFunction !== null) {
                this._setHighlightOnZoomedStage();
            } else {
                this.zoomedStage.update();
            }
            $("#" + this.stage.id).addClass("original-canvas-zoomed");
            $("#" + this.zoomedStage.id).addClass("canvas-zoomed-show");
            common.hideLoader()
        });
    }

    static _getCanvasWidth($canvas) {
        return Number.parseInt($canvas.attr("width"));
    }

    /**
     * Returns width that is available for canvas
     * (window width minus file menu and minus paddings)
     * @return {Number}
     */
    _getCanvasWidthForSection() {
        return window.innerWidth -
            AccumulativeTreeDrawer._getElementWidth(this.$fileMenu) -
            CANVAS_PADDING * 2;
    }

    /**
     * @param $element
     * @return {number}
     */
    static _getElementWidth($element) {
        /**
         * @type {String}
         */
        const string = $element.css("width");
        return Number.parseInt(string.substring(0, string.length - 2));
    }

    _enableResizeZoomedCanvas() {
        constants.$arrowLeft.click(this._updateCanvasWidthDecorator());
        constants.$arrowRight.click(this._updateCanvasWidthDecorator());
        const $window = $(window);
        let windowWidth = $window.width();
        $window.resize(common.updateRareDecorator(1000, () => {
            if (windowWidth !== $window.width()) { // if width was changed
                this._updateCanvasWidthDecorator()();
                windowWidth = $window.width();
            }
        }));
    }

    /**
     * @return {Function}
     * @protected
     */
    _updateCanvasWidthDecorator() {
        const that = this;
        return () => {
            setTimeout(() => {
                that._createCanvas();
                if (that.zoomedNode !== null) {
                    this._changeZoom(that.zoomedNode);
                }
                that._drawFullTree();
            }, 300)
        }
    }

    _createCanvas() {
        this.$section.find(".canvas-wrapper canvas").remove();
        const canvasContent = templates.tree.getAccumulativeTreeCanvas(
            {
                isNodeZoomed: this.zoomedNode !== null,
                canvasWidth: this._getCanvasWidthForSection(),
                canvasHeight: this.canvasHeight
            }
        ).content;
        this.$section.find(".canvas-wrapper").prepend($(canvasContent));

        this.stage = new createjs.Stage("canvas");
        this.stage.id = "canvas";
        this.zoomedStage = new createjs.Stage("canvas-zoomed");
        this.zoomedStage.id = "canvas-zoomed";
        this.stage.enableMouseOver(20);
        this.zoomedStage.enableMouseOver(10);
    }

    /**
     * @param node
     */
    _getNormalizedName(node) {
        const nodeInfo = node.getNodeInfo();
        if (nodeInfo === undefined) {
            return "";
        }
        let className = nodeInfo.getClassName();
        return (className + "." + nodeInfo.getMethodName()).toLowerCase();
    }

    _getOriginalColor(node) {
        const coefficient = this.packageList[AccumulativeTreeDrawer._getPackageName(node)];
        const h = 195 + coefficient * 40;
        const l = 50 + 10 * coefficient;
        return `hsl(${h}, 94%, ${l}%)`
    }

    /**
     * @param {String} desc
     * @return {String}
     * @private
     */
    static _getReturnValue(desc) {
        const bracket = desc.lastIndexOf(")");
        if (bracket === -1) {
            return "";
        }
        return desc.substring(bracket + 1, desc.length)
    }

    /**
     * @param {String} desc
     * @private
     * @return {Array}
     */
    static _getParameters(desc) {
        const openBracket = desc.indexOf("(");
        const closeBracket = desc.lastIndexOf(")");
        if (openBracket !== -1 && closeBracket !== -1) {
            return desc.substring(openBracket + 1, closeBracket).split(", ");
        }
        return [];
    }

    _getRightCornerPos(offsetX) {
        //noinspection JSValidateTypes
        return offsetX + this.$popup.outerWidth();
    }

    /**
     * @param {number} offsetX
     * @return {number}
     */
    _shiftIfHidden(offsetX) {
        const rightCorner = this._getRightCornerPos(offsetX);
        //noinspection JSValidateTypes
        return rightCorner > this.$canvasWrapper.outerWidth() + CANVAS_PADDING - 6 ?
            offsetX - (rightCorner - this.$canvasWrapper.outerWidth() - CANVAS_PADDING + 6) :
            offsetX;
    }
}