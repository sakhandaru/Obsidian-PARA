var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/plugin/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => DragNDropPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian6 = require("obsidian");

// src/runtime/editor-extension.ts
var import_view3 = require("@codemirror/view");

// src/shared/dom-selectors.ts
var ROOT_EDITOR_CLASS = "dnd-root-editor";
var MAIN_EDITOR_CONTENT_CLASS = "dnd-main-content";
var CODEMIRROR_EDITOR_CLASS = "cm-editor";
var CODEMIRROR_EDITOR_SELECTOR = `.${CODEMIRROR_EDITOR_CLASS}`;
var CODEMIRROR_CONTENT_CLASS = "cm-content";
var CODEMIRROR_CONTENT_SELECTOR = `.${CODEMIRROR_CONTENT_CLASS}`;
var CODEMIRROR_LINE_SELECTOR = ".cm-line";
var CODEMIRROR_GUTTERS_CLASS = "cm-gutters";
var CODEMIRROR_GUTTERS_SELECTOR = `.${CODEMIRROR_GUTTERS_CLASS}`;
var CODEMIRROR_GUTTERS_BEFORE_CLASS = "cm-gutters-before";
var CODEMIRROR_GUTTER_CLASS = "cm-gutter";
var CODEMIRROR_GUTTER_SELECTOR = `.${CODEMIRROR_GUTTER_CLASS}`;
var CODEMIRROR_GUTTER_ELEMENT_CLASS = "cm-gutterElement";
var CODEMIRROR_GUTTER_ELEMENT_SELECTOR = `.${CODEMIRROR_GUTTER_ELEMENT_CLASS}`;
var CODEMIRROR_LINE_NUMBERS_CLASS = "cm-lineNumbers";
var CODEMIRROR_LINE_NUMBER_GUTTER_SELECTOR = `${CODEMIRROR_GUTTER_SELECTOR}.${CODEMIRROR_LINE_NUMBERS_CLASS}, .${CODEMIRROR_LINE_NUMBERS_CLASS}`;
var EMBED_ROOT_SELECTOR = ".cm-embed-block";
var EMBED_BLOCK_SELECTOR = ".cm-embed-block, .cm-callout, .cm-preview-code-block, .cm-math, .MathJax_Display, .callout, .MathJax, .mjx-container";
var TEXT_BLOCK_PROBE_SELECTOR = `${EMBED_BLOCK_SELECTOR}, ${CODEMIRROR_LINE_SELECTOR}`;
var TABLE_WIDGET_SELECTOR = ".cm-table-widget";
var DROP_INDICATOR_SELECTOR = ".dnd-drop-indicator";
var DROP_HIGHLIGHT_SELECTOR = ".dnd-drop-highlight";
var HIDDEN_CLASS = "dnd-hidden";
var DRAG_HANDLE_CLASS = "dnd-drag-handle";
var HANDLE_CORE_CLASS = "dnd-handle-core";
var LINE_HANDLE_CLASS = "dnd-line-handle";
var EMBED_HANDLE_CLASS = "dnd-embed-handle";
var HANDLE_GUTTER_CLASS = "cm-dnd-handle-gutter";
var HANDLE_GUTTER_MARKER_CLASS = "dnd-handle-gutter-marker";
var DROP_INDICATOR_CLASS = "dnd-drop-indicator";
var DROP_HIGHLIGHT_CLASS = "dnd-drop-highlight";
var DRAGGING_BODY_CLASS = "dnd-dragging";
var DRAG_SOURCE_LINE_CLASS = "dnd-drag-source-line";
var DRAG_SOURCE_LINE_SINGLE_CLASS = "dnd-drag-source-line-single";
var DRAG_SOURCE_LINE_FIRST_CLASS = "dnd-drag-source-line-first";
var DRAG_SOURCE_LINE_MIDDLE_CLASS = "dnd-drag-source-line-middle";
var DRAG_SOURCE_LINE_LAST_CLASS = "dnd-drag-source-line-last";
var DRAG_SOURCE_EMBED_CLASS = "dnd-drag-source-embed";
var RANGE_SELECTED_LINE_CLASS = "dnd-range-selected-line";
var RANGE_SELECTED_HANDLE_CLASS = "dnd-range-selected-handle";
var MOBILE_SELECTION_RESIZE_HANDLE_CLASS = "dnd-mobile-selection-resize-handle";
var MOBILE_SELECTION_RESIZE_HANDLE_TOP_CLASS = "dnd-mobile-selection-resize-handle-top";
var MOBILE_SELECTION_RESIZE_HANDLE_BOTTOM_CLASS = "dnd-mobile-selection-resize-handle-bottom";
var FILE_DROP_TARGET_CLASS = "dnd-file-drop-target";
var MOBILE_GESTURE_LOCK_CLASS = "dnd-mobile-gesture-lock";

// src/drag/gesture/drag-session.ts
var activeDragSourceByView = /* @__PURE__ */ new WeakMap();
var knownViewRefs = /* @__PURE__ */ new Set();
function beginDragSession(blockInfo, view) {
  setActiveDragSourceBlock(view, blockInfo);
  document.body.classList.add(DRAGGING_BODY_CLASS);
}
function finishDragSession(view) {
  if (view) {
    clearActiveDragSourceBlock(view);
  } else {
    clearAllActiveDragSourceBlocks();
  }
  if (!getActiveDragSourceEntry()) {
    document.body.classList.remove(DRAGGING_BODY_CLASS);
  }
  hideDropVisuals();
}
function setActiveDragSourceBlock(view, block) {
  if (block) {
    activeDragSourceByView.set(view, block);
    knownViewRefs.add(new WeakRef(view));
    return;
  }
  activeDragSourceByView.delete(view);
  removeWeakRef(knownViewRefs, view);
}
function getActiveDragSourceBlock(view) {
  var _a, _b, _c;
  if (view) {
    return (_a = activeDragSourceByView.get(view)) != null ? _a : null;
  }
  return (_c = (_b = getActiveDragSourceEntry()) == null ? void 0 : _b.block) != null ? _c : null;
}
function getActiveDragSourceView() {
  var _a, _b;
  return (_b = (_a = getActiveDragSourceEntry()) == null ? void 0 : _a.view) != null ? _b : null;
}
function getActiveDragSourceEntry() {
  for (const ref of knownViewRefs) {
    const view = ref.deref();
    if (!view) {
      knownViewRefs.delete(ref);
      continue;
    }
    const block = activeDragSourceByView.get(view);
    if (block) {
      return { view, block };
    }
  }
  return null;
}
function clearActiveDragSourceBlock(view) {
  activeDragSourceByView.delete(view);
  removeWeakRef(knownViewRefs, view);
}
function clearAllActiveDragSourceBlocks() {
  for (const ref of knownViewRefs) {
    const v = ref.deref();
    if (v)
      activeDragSourceByView.delete(v);
  }
  knownViewRefs.clear();
}
function removeWeakRef(set, target) {
  for (const ref of set) {
    const v = ref.deref();
    if (!v || v === target) {
      set.delete(ref);
    }
  }
}
function hideDropVisuals(scope = document) {
  scope.querySelectorAll(DROP_INDICATOR_SELECTOR).forEach((el) => {
    el.classList.add(HIDDEN_CLASS);
  });
  scope.querySelectorAll(DROP_HIGHLIGHT_SELECTOR).forEach((el) => {
    el.classList.add(HIDDEN_CLASS);
  });
}

// src/platform/dom/table-guard.ts
function isElementInsideRenderedTableCell(view, el) {
  if (!el)
    return false;
  if (!view.dom.contains(el))
    return false;
  const tableWidget = el.closest(TABLE_WIDGET_SELECTOR);
  if (!tableWidget || !view.dom.contains(tableWidget))
    return false;
  if (el.closest("td, th, .cm-table-cell, .table-cell-wrapper"))
    return true;
  if (el.closest(CODEMIRROR_LINE_SELECTOR))
    return true;
  return true;
}
function isPointInsideRenderedTableCell(view, x, y) {
  const rawEl = document.elementFromPoint(x, y);
  const el = rawEl instanceof HTMLElement ? rawEl : null;
  return isElementInsideRenderedTableCell(view, el);
}
function isPosInsideRenderedTableCell(view, pos, options) {
  const doc = view.state.doc;
  const safePos = Math.max(0, Math.min(pos, doc.length));
  try {
    const domAt = view.domAtPos(safePos);
    const node = domAt.node instanceof HTMLElement ? domAt.node : domAt.node.parentElement;
    if (isElementInsideRenderedTableCell(view, node))
      return true;
  } catch (e) {
  }
  if (options == null ? void 0 : options.skipLayoutRead)
    return false;
  let coords = null;
  try {
    coords = view.coordsAtPos(safePos);
  } catch (e) {
    return false;
  }
  if (!coords)
    return false;
  const editorRect = view.dom.getBoundingClientRect();
  const probeX = Math.min(Math.max(coords.left + 6, editorRect.left + 2), editorRect.right - 2);
  const probeY = Math.min(Math.max((coords.top + coords.bottom) / 2, editorRect.top + 2), editorRect.bottom - 2);
  return isPointInsideRenderedTableCell(view, probeX, probeY);
}

// src/domain/block/block-types.ts
var BlockType = /* @__PURE__ */ ((BlockType2) => {
  BlockType2["Paragraph"] = "paragraph";
  BlockType2["Heading"] = "heading";
  BlockType2["ListItem"] = "list-item";
  BlockType2["CodeBlock"] = "code-block";
  BlockType2["Blockquote"] = "blockquote";
  BlockType2["Table"] = "table";
  BlockType2["MathBlock"] = "math-block";
  BlockType2["Callout"] = "callout";
  BlockType2["HorizontalRule"] = "hr";
  BlockType2["Unknown"] = "unknown";
  return BlockType2;
})(BlockType || {});

// src/domain/block/block-guards.ts
function isHorizontalRuleLine(text) {
  if (!text)
    return false;
  const trimmed = text.trim();
  if (trimmed.length < 3)
    return false;
  return /^([-*_])(?:\s*\1){2,}$/.test(trimmed);
}
function isBlockquoteLine(text) {
  if (!text)
    return false;
  return /^(> ?)+/.test(text.trimStart());
}
function isCalloutLine(text) {
  if (!text)
    return false;
  return /^(\s*> ?)+\s*\[!/.test(text.trimStart());
}
function isTableLine(text) {
  if (!text)
    return false;
  return text.trimStart().startsWith("|");
}
function isMathFenceLine(text) {
  if (!text)
    return false;
  return text.trimStart().startsWith("$$");
}
function isCodeFenceLine(text) {
  if (!text)
    return false;
  return text.trimStart().startsWith("```");
}

// src/domain/rules/insertion-rules.ts
var ALL_TYPES = Object.values(BlockType);
function rejectEntries(types, slot, reason) {
  return types.map((t2) => [`${t2}|${slot}`, reason]);
}
var REJECT_RULES = new Map([
  // inside_list: only ListItem allowed
  ...rejectEntries(
    ALL_TYPES.filter((t2) => t2 !== "list-item" /* ListItem */),
    "inside_list",
    "inside_list"
  ),
  // inside_quote_run: only Blockquote allowed (not Callout)
  ...rejectEntries(
    ALL_TYPES.filter((t2) => t2 !== "blockquote" /* Blockquote */),
    "inside_quote_run",
    "inside_quote_run"
  ),
  // quote_before: Callout blocked
  ...rejectEntries(["callout" /* Callout */], "quote_before", "quote_boundary"),
  // quote_after: only Blockquote allowed
  ...rejectEntries(
    ALL_TYPES.filter((t2) => t2 !== "blockquote" /* Blockquote */),
    "quote_after",
    "quote_boundary"
  ),
  // callout_after, table_before, hr_before: block ALL source types
  ...rejectEntries(ALL_TYPES, "callout_after", "callout_after"),
  ...rejectEntries(ALL_TYPES, "table_before", "table_before"),
  ...rejectEntries(ALL_TYPES, "hr_before", "hr_before")
]);
function resolveInsertionRule(input) {
  var _a;
  const key = `${input.sourceType}|${input.slotContext}`;
  const rejectReason = (_a = REJECT_RULES.get(key)) != null ? _a : null;
  return {
    allowDrop: rejectReason === null,
    rejectReason
  };
}

// src/domain/markdown/line-map.ts
var import_state = require("@codemirror/state");

// src/domain/markdown/line-parser.ts
function getIndentWidthFromIndentRaw(indentRaw, tabSize) {
  const safeTabSize2 = tabSize > 0 ? tabSize : 4;
  let width = 0;
  for (const ch of indentRaw) {
    width += ch === "	" ? safeTabSize2 : 1;
  }
  return width;
}
function splitBlockquotePrefix(line) {
  const match = line.match(/^(\s*> ?)+/);
  if (!match)
    return { prefix: "", rest: line };
  return { prefix: match[0], rest: line.slice(match[0].length) };
}
function getBlockquoteDepthFromLine(line) {
  const match = line.match(/^(\s*> ?)+/);
  if (!match)
    return 0;
  const prefix = match[0];
  return (prefix.match(/>/g) || []).length;
}
function parseListLine(line, tabSize) {
  const indentMatch = line.match(/^(\s*)/);
  const indentRaw = indentMatch ? indentMatch[1] : "";
  const indentWidth = getIndentWidthFromIndentRaw(indentRaw, tabSize);
  const rest = line.slice(indentRaw.length);
  const taskMatch = rest.match(/^([-*+])\s\[[ xX]\]\s+/);
  if (taskMatch) {
    const marker = taskMatch[0];
    return { isListItem: true, indentRaw, indentWidth, marker, markerType: "task", content: rest.slice(marker.length) };
  }
  const unorderedMatch = rest.match(/^([-*+])\s+/);
  if (unorderedMatch) {
    const marker = unorderedMatch[0];
    return { isListItem: true, indentRaw, indentWidth, marker, markerType: "unordered", content: rest.slice(marker.length) };
  }
  const orderedMatch = rest.match(/^(\d+)[.)]\s+/);
  if (orderedMatch) {
    const marker = orderedMatch[0];
    return { isListItem: true, indentRaw, indentWidth, marker, markerType: "ordered", content: rest.slice(marker.length) };
  }
  return { isListItem: false, indentRaw, indentWidth, marker: "", markerType: "unordered", content: rest };
}
function parseLineWithQuote(line, tabSize) {
  const quoteInfo = splitBlockquotePrefix(line);
  const parsed = parseListLine(quoteInfo.rest, tabSize);
  return {
    text: line,
    quotePrefix: quoteInfo.prefix,
    quoteDepth: getBlockquoteDepthFromLine(line),
    rest: quoteInfo.rest,
    isListItem: parsed.isListItem,
    indentRaw: parsed.indentRaw,
    indentWidth: parsed.indentWidth,
    marker: parsed.marker,
    markerType: parsed.markerType,
    content: parsed.content
  };
}

// src/shared/utils/timing.ts
function nowMs() {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

// src/domain/markdown/indent-helpers.ts
function buildIndentStringFromSample(sample, width, tabSize) {
  const safeWidth = Math.max(0, width);
  if (safeWidth === 0)
    return "";
  if (sample.includes("	")) {
    const tabs = Math.max(0, Math.floor(safeWidth / tabSize));
    const spaces = Math.max(0, safeWidth - tabs * tabSize);
    return "	".repeat(tabs) + " ".repeat(spaces);
  }
  return " ".repeat(safeWidth);
}
function getIndentUnitWidth(sample, tabSize) {
  if (sample.includes("	"))
    return tabSize;
  if (sample.length >= tabSize)
    return tabSize;
  return sample.length > 0 ? sample.length : tabSize;
}

// src/domain/markdown/indent-calculator.ts
var indentUnitWidthCache = /* @__PURE__ */ new WeakMap();
function normalizeTabSize(tabSize) {
  const safe = tabSize != null ? tabSize : 4;
  return safe > 0 ? safe : 4;
}
function parseLineWithQuote2(line, tabSize) {
  return parseLineWithQuote(line, normalizeTabSize(tabSize));
}
function getIndentUnitWidthFromDoc(doc, parseLine, fallbackTabSize) {
  let best = Number.POSITIVE_INFINITY;
  let prevIndent = null;
  for (let i = 1; i <= doc.lines; i++) {
    const text = doc.line(i).text;
    const parsed = parseLine(text);
    if (!parsed.isListItem)
      continue;
    if (prevIndent !== null && parsed.indentWidth > prevIndent) {
      const delta = parsed.indentWidth - prevIndent;
      if (delta > 0 && delta < best)
        best = delta;
    }
    prevIndent = parsed.indentWidth;
  }
  if (!isFinite(best)) {
    return normalizeTabSize(fallbackTabSize);
  }
  return Math.max(2, best);
}
function getIndentUnitWidthForDoc(doc, parseLine, fallbackTabSize) {
  if (doc && typeof doc === "object") {
    const cached = indentUnitWidthCache.get(doc);
    if (typeof cached === "number") {
      return cached;
    }
  }
  const fromDoc = getIndentUnitWidthFromDoc(doc, parseLine, fallbackTabSize);
  const resolved = typeof fromDoc === "number" ? fromDoc : normalizeTabSize(fallbackTabSize);
  if (doc && typeof doc === "object") {
    indentUnitWidthCache.set(doc, resolved);
  }
  return resolved;
}
function buildIndentStringFromSample2(sample, width, tabSize) {
  return buildIndentStringFromSample(sample, width, normalizeTabSize(tabSize));
}
function getIndentUnitWidth2(sample, tabSize) {
  return getIndentUnitWidth(sample, normalizeTabSize(tabSize));
}

// src/domain/markdown/line-map.ts
var lineMapPerfRecorder = null;
var lineMapCache = /* @__PURE__ */ new WeakMap();
var EMPTY_LINE_META = {
  isEmpty: true,
  isList: false,
  isQuote: false,
  isCallout: false,
  isTable: false,
  isHr: false,
  indentWidth: 0,
  quoteDepth: 0
};
function recordLineMapPerf(key, durationMs) {
  if (!lineMapPerfRecorder)
    return;
  if (!isFinite(durationMs) || durationMs < 0)
    return;
  lineMapPerfRecorder(key, durationMs);
}
function setLineMapPerfRecorder(recorder) {
  lineMapPerfRecorder = recorder;
}
function resolveStateTabSize(state) {
  if (!state || typeof state !== "object")
    return 4;
  try {
    const withFacet = state;
    if (typeof withFacet.facet === "function") {
      return normalizeTabSize(withFacet.facet(import_state.EditorState.tabSize));
    }
  } catch (e) {
  }
  return 4;
}
function createLineMetaFromText(text, tabSize) {
  const parsed = parseLineWithQuote(text, tabSize);
  const isEmpty = text.trim().length === 0;
  return {
    isEmpty,
    isList: parsed.isListItem,
    isQuote: parsed.quoteDepth > 0,
    isCallout: isCalloutLine(text),
    isTable: text.trimStart().startsWith("|"),
    isHr: isHorizontalRuleLine(text),
    indentWidth: parsed.indentWidth,
    quoteDepth: parsed.quoteDepth
  };
}
function createLineMetaArray(doc, tabSize) {
  var _a;
  const lineMeta = new Array(doc.lines + 1);
  lineMeta[0] = EMPTY_LINE_META;
  for (let i = 1; i <= doc.lines; i++) {
    lineMeta[i] = createLineMetaFromText((_a = doc.line(i).text) != null ? _a : "", tabSize);
  }
  return lineMeta;
}
function buildLineMapIndexes(lineMeta, totalLines) {
  var _a, _b, _c;
  const prevNonEmpty = new Int32Array(totalLines + 2);
  const nextNonEmpty = new Int32Array(totalLines + 2);
  const prevListLine = new Int32Array(totalLines + 2);
  const listParentLine = new Int32Array(totalLines + 2);
  const listSubtreeEndLine = new Int32Array(totalLines + 2);
  let previous = 0;
  let previousList = 0;
  const listStack = [];
  for (let i = 1; i <= totalLines; i++) {
    const meta = (_a = lineMeta[i]) != null ? _a : EMPTY_LINE_META;
    if (!meta.isEmpty) {
      previous = i;
    }
    prevNonEmpty[i] = previous;
    if (meta.isEmpty) {
      prevListLine[i] = previousList;
      continue;
    }
    while (listStack.length > 0) {
      const topLine = listStack[listStack.length - 1];
      const topMeta = (_b = lineMeta[topLine]) != null ? _b : EMPTY_LINE_META;
      if (meta.indentWidth > topMeta.indentWidth) {
        break;
      }
      listStack.pop();
    }
    for (const ancestorLine of listStack) {
      listSubtreeEndLine[ancestorLine] = i;
    }
    prevListLine[i] = previousList;
    if (!meta.isList) {
      continue;
    }
    listParentLine[i] = listStack.length > 0 ? listStack[listStack.length - 1] : 0;
    listSubtreeEndLine[i] = i;
    listStack.push(i);
    previousList = i;
  }
  let next = 0;
  for (let i = totalLines; i >= 1; i--) {
    const meta = (_c = lineMeta[i]) != null ? _c : EMPTY_LINE_META;
    if (!meta.isEmpty) {
      next = i;
    }
    nextNonEmpty[i] = next;
  }
  return {
    prevNonEmpty,
    nextNonEmpty,
    prevListLine,
    listParentLine,
    listSubtreeEndLine
  };
}
function createLineMapFromMeta(doc, tabSize, lineMeta) {
  const indexes = buildLineMapIndexes(lineMeta, doc.lines);
  return {
    doc,
    lineMeta,
    prevNonEmpty: indexes.prevNonEmpty,
    nextNonEmpty: indexes.nextNonEmpty,
    prevListLine: indexes.prevListLine,
    listParentLine: indexes.listParentLine,
    listSubtreeEndLine: indexes.listSubtreeEndLine,
    tabSize
  };
}
function buildLineMap(state, options) {
  var _a;
  const doc = state.doc;
  const tabSize = normalizeTabSize((_a = options == null ? void 0 : options.tabSize) != null ? _a : resolveStateTabSize(state));
  const lineMeta = createLineMetaArray(doc, tabSize);
  return createLineMapFromMeta(doc, tabSize, lineMeta);
}
function getCachedLineMapForDoc(doc, tabSize) {
  var _a, _b;
  if (!doc || typeof doc !== "object")
    return null;
  return (_b = (_a = lineMapCache.get(doc)) == null ? void 0 : _a.get(tabSize)) != null ? _b : null;
}
function setCachedLineMapForDoc(doc, tabSize, lineMap) {
  const byTabSize = lineMapCache.get(doc);
  if (byTabSize) {
    byTabSize.set(tabSize, lineMap);
    return;
  }
  lineMapCache.set(doc, /* @__PURE__ */ new Map([[tabSize, lineMap]]));
}
function getLineMap(state, options) {
  var _a;
  const startedAt = nowMs();
  const tabSize = normalizeTabSize((_a = options == null ? void 0 : options.tabSize) != null ? _a : resolveStateTabSize(state));
  if (!state || typeof state !== "object") {
    const buildStartedAt2 = nowMs();
    const built2 = buildLineMap(state, { tabSize });
    recordLineMapPerf("line_map_build", nowMs() - buildStartedAt2);
    recordLineMapPerf("line_map_get", nowMs() - startedAt);
    return built2;
  }
  const doc = state.doc;
  if (!doc || typeof doc !== "object") {
    const buildStartedAt2 = nowMs();
    const built2 = buildLineMap(state, { tabSize });
    recordLineMapPerf("line_map_build", nowMs() - buildStartedAt2);
    recordLineMapPerf("line_map_get", nowMs() - startedAt);
    return built2;
  }
  const cached = getCachedLineMapForDoc(doc, tabSize);
  if (cached) {
    recordLineMapPerf("line_map_get", nowMs() - startedAt);
    return cached;
  }
  const buildStartedAt = nowMs();
  const built = buildLineMap(state, { tabSize });
  recordLineMapPerf("line_map_build", nowMs() - buildStartedAt);
  setCachedLineMapForDoc(doc, tabSize, built);
  recordLineMapPerf("line_map_get", nowMs() - startedAt);
  return built;
}
function peekCachedLineMap(state, options) {
  var _a;
  const tabSize = normalizeTabSize((_a = options == null ? void 0 : options.tabSize) != null ? _a : resolveStateTabSize(state));
  if (!state || typeof state !== "object")
    return null;
  const doc = state.doc;
  if (!doc || typeof doc !== "object")
    return null;
  return getCachedLineMapForDoc(doc, tabSize);
}
function getLineMetaAt(lineMap, lineNumber) {
  var _a;
  if (lineNumber < 1 || lineNumber >= lineMap.lineMeta.length)
    return null;
  return (_a = lineMap.lineMeta[lineNumber]) != null ? _a : null;
}
function getNearestListLineAtOrBefore(lineMap, lineNumber) {
  if (lineMap.doc.lines <= 0)
    return null;
  const clamped = Math.max(1, Math.min(lineMap.doc.lines, lineNumber));
  const meta = getLineMetaAt(lineMap, clamped);
  if (meta == null ? void 0 : meta.isList)
    return clamped;
  const prevListLine = lineMap.prevListLine[clamped];
  return prevListLine > 0 ? prevListLine : null;
}

// src/domain/mutation/list-mutation.ts
function getListContext(doc, lineNumber, parseLineWithQuote3) {
  return getListContextNearLine(doc, lineNumber, parseLineWithQuote3);
}
function parseListContextFromLine(doc, lineNumber, parseLineWithQuote3) {
  if (lineNumber < 1 || lineNumber > doc.lines) {
    return { context: null, isBlank: true, isList: false };
  }
  const text = doc.line(lineNumber).text;
  const isBlank = text.trim().length === 0;
  const parsed = parseLineWithQuote3(text);
  if (!parsed.isListItem) {
    return { context: null, isBlank, isList: false };
  }
  return {
    context: {
      indentWidth: parsed.indentWidth,
      indentRaw: parsed.indentRaw,
      markerType: parsed.markerType
    },
    isBlank,
    isList: true
  };
}
function getListContextNearLine(doc, lineNumber, parseLineWithQuote3, options) {
  var _a, _b, _c, _d;
  const scanUp = Math.max(0, (_a = options == null ? void 0 : options.scanUp) != null ? _a : 8);
  const scanDown = Math.max(0, (_b = options == null ? void 0 : options.scanDown) != null ? _b : 3);
  const skipBlankLines = (_c = options == null ? void 0 : options.skipBlankLines) != null ? _c : true;
  const stopAtNonListContent = (_d = options == null ? void 0 : options.stopAtNonListContent) != null ? _d : true;
  const current = parseListContextFromLine(doc, lineNumber, parseLineWithQuote3);
  if (current.context)
    return current.context;
  if (!skipBlankLines && current.isBlank)
    return null;
  let stopUp = false;
  let stopDown = false;
  for (let distance = 1; distance <= Math.max(scanUp, scanDown); distance++) {
    if (!stopUp && distance <= scanUp) {
      const upLineNumber = lineNumber - distance;
      if (upLineNumber >= 1) {
        const up = parseListContextFromLine(doc, upLineNumber, parseLineWithQuote3);
        if (up.context)
          return up.context;
        if (!up.isBlank && !up.isList && stopAtNonListContent) {
          stopUp = true;
        }
      }
    }
    if (!stopDown && distance <= scanDown) {
      const downLineNumber = lineNumber + distance;
      if (downLineNumber <= doc.lines) {
        const down = parseListContextFromLine(doc, downLineNumber, parseLineWithQuote3);
        if (down.context)
          return down.context;
        if (!down.isBlank && !down.isList && stopAtNonListContent) {
          stopDown = true;
        }
      }
    }
    if (stopUp && stopDown)
      break;
  }
  return null;
}
function getSourceListBase(lines, parseLineWithQuote3) {
  for (const line of lines) {
    const parsed = parseLineWithQuote3(line);
    if (parsed.isListItem) {
      return { indentWidth: parsed.indentWidth, indentRaw: parsed.indentRaw };
    }
  }
  return null;
}
function computeListIndentPlan(params) {
  var _a, _b;
  const {
    doc,
    sourceBase,
    targetLineNumber,
    parseLineWithQuote: parseLineWithQuote3,
    getIndentUnitWidth: getIndentUnitWidthFn,
    getListContext: getListContextFn,
    listIntent
  } = params;
  const listContextLineNumber = (_a = listIntent == null ? void 0 : listIntent.contextLineNumber) != null ? _a : targetLineNumber;
  const targetContext = getListContextFn ? getListContextFn(doc, listContextLineNumber) : getListContextNearLine(doc, listContextLineNumber, parseLineWithQuote3);
  const indentSample = targetContext ? targetContext.indentRaw : sourceBase.indentRaw;
  const indentUnitWidth = getIndentUnitWidthFn(indentSample || sourceBase.indentRaw);
  const indentDeltaBase = (targetContext ? targetContext.indentWidth : 0) - sourceBase.indentWidth;
  let indentDelta = indentDeltaBase + ((_b = listIntent == null ? void 0 : listIntent.indentDelta) != null ? _b : 0) * indentUnitWidth;
  if (typeof (listIntent == null ? void 0 : listIntent.targetIndentWidth) === "number") {
    indentDelta = listIntent.targetIndentWidth - sourceBase.indentWidth;
  }
  return {
    listContextLineNumber,
    targetContext,
    indentSample,
    indentUnitWidth,
    indentDelta,
    targetIndentWidth: sourceBase.indentWidth + indentDelta,
    sourceBaseIndentWidth: sourceBase.indentWidth
  };
}
function adjustListToTargetContext(params) {
  const {
    doc,
    sourceContent,
    targetLineNumber,
    parseLineWithQuote: parseLineWithQuote3,
    getIndentUnitWidth: getIndentUnitWidthFn,
    buildIndentStringFromSample: buildIndentStringFromSampleFn,
    buildTargetMarker: buildTargetMarkerFn,
    markerConversionScope,
    getListContext: getListContextFn,
    listIntent
  } = params;
  const lines = sourceContent.split("\n");
  const sourceBase = getSourceListBase(lines, parseLineWithQuote3);
  if (!sourceBase)
    return sourceContent;
  const indentPlan = computeListIndentPlan({
    doc,
    sourceBase,
    targetLineNumber,
    parseLineWithQuote: parseLineWithQuote3,
    getIndentUnitWidth: getIndentUnitWidthFn,
    getListContext: getListContextFn,
    listIntent
  });
  const markerScope = markerConversionScope != null ? markerConversionScope : "root";
  const quoteAdjustedLines = lines.map((line) => {
    if (line.trim().length === 0)
      return line;
    const parsed = parseLineWithQuote3(line);
    const rest = parsed.rest;
    if (!parsed.isListItem) {
      if (parsed.indentWidth >= sourceBase.indentWidth) {
        const newIndent2 = buildIndentStringFromSampleFn(
          indentPlan.indentSample,
          parsed.indentWidth + indentPlan.indentDelta
        );
        return `${parsed.quotePrefix}${newIndent2}${rest.slice(parsed.indentRaw.length)}`;
      }
      return line;
    }
    const newIndent = buildIndentStringFromSampleFn(
      indentPlan.indentSample,
      parsed.indentWidth + indentPlan.indentDelta
    );
    let marker = parsed.marker;
    const shouldConvertMarker = markerScope === "none" ? false : markerScope === "all" ? !!indentPlan.targetContext : !!indentPlan.targetContext && parsed.indentWidth === sourceBase.indentWidth;
    if (shouldConvertMarker && indentPlan.targetContext) {
      marker = buildTargetMarkerFn(indentPlan.targetContext, parsed);
    }
    return `${parsed.quotePrefix}${newIndent}${marker}${parsed.content}`;
  });
  return quoteAdjustedLines.join("\n");
}

// src/shared/utils/line-range.ts
function normalizeLineRange(docLines, startLineNumber, endLineNumber) {
  const safeStart = Math.max(1, Math.min(docLines, Math.min(startLineNumber, endLineNumber)));
  const safeEnd = Math.max(1, Math.min(docLines, Math.max(startLineNumber, endLineNumber)));
  return {
    startLineNumber: safeStart,
    endLineNumber: safeEnd
  };
}
function mergeLineRanges(docLines, ranges) {
  const normalized = ranges.map((range) => normalizeLineRange(docLines, range.startLineNumber, range.endLineNumber)).sort((a, b) => a.startLineNumber - b.startLineNumber);
  const merged = [];
  for (const range of normalized) {
    const last = merged[merged.length - 1];
    if (!last || range.startLineNumber > last.endLineNumber + 1) {
      merged.push({ ...range });
      continue;
    }
    if (range.endLineNumber > last.endLineNumber) {
      last.endLineNumber = range.endLineNumber;
    }
  }
  return merged;
}
function isLineNumberInRanges(lineNumber, ranges) {
  for (const range of ranges) {
    if (lineNumber >= range.startLineNumber && lineNumber <= range.endLineNumber) {
      return true;
    }
  }
  return false;
}

// src/shared/utils/composite-selection.ts
function normalizeCompositeRanges(ranges, totalLines) {
  if (totalLines <= 0) {
    return [];
  }
  const lineRanges = ranges.map((range) => ({
    startLineNumber: range.startLine + 1,
    endLineNumber: range.endLine + 1
  }));
  return mergeLineRanges(totalLines, lineRanges).map((range) => ({
    startLine: range.startLineNumber - 1,
    endLine: range.endLineNumber - 1
  }));
}

// src/domain/rules/drop-validation.ts
function sourceRangesAreListStructured(params) {
  const { doc, sourceBlock, parseLineWithQuote: parseLineWithQuote3, ranges } = params;
  if (sourceBlock.type !== "list-item" /* ListItem */)
    return false;
  for (const range of ranges) {
    let foundContent = false;
    for (let lineNumber = range.startLine + 1; lineNumber <= range.endLine + 1; lineNumber++) {
      const text = doc.line(lineNumber).text;
      if (text.trim().length === 0)
        continue;
      foundContent = true;
      if (!parseLineWithQuote3(text).isListItem)
        return false;
    }
    if (!foundContent)
      return false;
  }
  return true;
}
function validateInPlaceDrop(params) {
  var _a, _b, _c, _d, _e, _f, _g;
  const {
    doc,
    sourceBlock,
    targetLineNumber,
    parseLineWithQuote: parseLineWithQuote3,
    getListContext: getListContext2,
    getIndentUnitWidth: getIndentUnitWidth3,
    slotContext,
    lineMap,
    listIntent
  } = params;
  if (typeof slotContext === "string") {
    const containerRule = resolveInsertionRule({
      sourceType: sourceBlock.type,
      slotContext
    });
    if (!containerRule.allowDrop) {
      return {
        inSelfRange: false,
        allowInPlaceIndentChange: false,
        rejectReason: (_a = containerRule.rejectReason) != null ? _a : "container_policy"
      };
    }
  }
  const targetLineIdx = targetLineNumber - 1;
  const compositeRanges = normalizeCompositeRanges(
    (_c = (_b = sourceBlock.compositeSelection) == null ? void 0 : _b.ranges) != null ? _c : [],
    doc.lines
  );
  const effectiveSourceRange = {
    startLine: (_e = (_d = compositeRanges[0]) == null ? void 0 : _d.startLine) != null ? _e : sourceBlock.startLine,
    endLine: (_g = (_f = compositeRanges[compositeRanges.length - 1]) == null ? void 0 : _f.endLine) != null ? _g : sourceBlock.endLine
  };
  const inSelectedRange = compositeRanges.some((range) => targetLineIdx >= range.startLine && targetLineIdx <= range.endLine);
  const inSelfRange = inSelectedRange || targetLineIdx === effectiveSourceRange.endLine + 1;
  if (!inSelfRange) {
    return { inSelfRange: false, allowInPlaceIndentChange: false };
  }
  const hasListIntent = (listIntent == null ? void 0 : listIntent.targetIndentWidth) !== void 0 || (listIntent == null ? void 0 : listIntent.indentDelta) !== void 0;
  if (!hasListIntent) {
    return {
      inSelfRange: true,
      allowInPlaceIndentChange: false,
      rejectReason: "self_range_blocked"
    };
  }
  if (!sourceRangesAreListStructured({
    doc,
    sourceBlock,
    parseLineWithQuote: parseLineWithQuote3,
    ranges: compositeRanges.length > 0 ? compositeRanges : [effectiveSourceRange]
  })) {
    return {
      inSelfRange: true,
      allowInPlaceIndentChange: false,
      rejectReason: "self_range_blocked"
    };
  }
  const sourceLineNumber = effectiveSourceRange.startLine + 1;
  const sourceLineMeta = lineMap ? getLineMetaAt(lineMap, sourceLineNumber) : null;
  if (sourceLineMeta && !sourceLineMeta.isList) {
    return {
      inSelfRange: true,
      allowInPlaceIndentChange: false,
      rejectReason: "self_range_blocked"
    };
  }
  const sourceLineText = doc.line(sourceLineNumber).text;
  const sourceParsed = parseLineWithQuote3(sourceLineText);
  if (!sourceParsed.isListItem) {
    return {
      inSelfRange: true,
      allowInPlaceIndentChange: false,
      rejectReason: "self_range_blocked"
    };
  }
  const indentPlan = computeListIndentPlan({
    doc,
    sourceBase: {
      indentWidth: sourceParsed.indentWidth,
      indentRaw: sourceParsed.indentRaw
    },
    targetLineNumber,
    parseLineWithQuote: parseLineWithQuote3,
    getIndentUnitWidth: getIndentUnitWidth3,
    getListContext: getListContext2,
    listIntent
  });
  const targetIndentWidth = indentPlan.targetIndentWidth;
  const listContextLineNumber = indentPlan.listContextLineNumber;
  const isAfterSelf = targetLineIdx === effectiveSourceRange.endLine + 1;
  const isSameLine = targetLineIdx === effectiveSourceRange.startLine;
  const sourceEndLineNumber = effectiveSourceRange.endLine + 1;
  const isSelfContext = listContextLineNumber === sourceLineNumber;
  const isContextInsideSource = listContextLineNumber >= sourceLineNumber && listContextLineNumber <= sourceEndLineNumber;
  if (isAfterSelf && isContextInsideSource && targetIndentWidth > sourceParsed.indentWidth) {
    return {
      inSelfRange: true,
      allowInPlaceIndentChange: false,
      rejectReason: "self_embedding",
      listContextLineNumber,
      targetIndentWidth
    };
  }
  const allowInPlaceIndentChange = isAfterSelf && targetIndentWidth !== sourceParsed.indentWidth || isSameLine && targetIndentWidth !== sourceParsed.indentWidth && !isSelfContext || !isAfterSelf && targetIndentWidth < sourceParsed.indentWidth;
  if (!allowInPlaceIndentChange) {
    return {
      inSelfRange: true,
      allowInPlaceIndentChange: false,
      rejectReason: "self_range_blocked",
      listContextLineNumber,
      targetIndentWidth
    };
  }
  return {
    inSelfRange: true,
    allowInPlaceIndentChange,
    listContextLineNumber,
    targetIndentWidth
  };
}

// src/shared/utils/line-target-number.ts
function clampTargetLineNumber(totalLines, lineNumber) {
  if (lineNumber < 1)
    return 1;
  if (lineNumber > totalLines + 1)
    return totalLines + 1;
  return lineNumber;
}

// src/drag/move/list-renumberer.ts
var ListRenumberer = class {
  constructor(deps) {
    this.deps = deps;
  }
  renumberOrderedListAround(lineNumber) {
    const view = this.deps.view;
    const doc = view.state.doc;
    if (lineNumber < 1 || lineNumber > doc.lines)
      return;
    const findOrderedAt = (n) => {
      const text = doc.line(n).text;
      const parsed = this.deps.parseLineWithQuote(text);
      if (parsed.isListItem && parsed.markerType === "ordered") {
        return { indentWidth: parsed.indentWidth, quoteDepth: parsed.quoteDepth };
      }
      return null;
    };
    let anchor = findOrderedAt(lineNumber);
    if (!anchor && lineNumber > 1)
      anchor = findOrderedAt(lineNumber - 1);
    if (!anchor && lineNumber < doc.lines)
      anchor = findOrderedAt(lineNumber + 1);
    if (!anchor)
      return;
    let start = lineNumber;
    while (start > 1) {
      const info = findOrderedAt(start - 1);
      if (!info || info.indentWidth !== anchor.indentWidth || info.quoteDepth !== anchor.quoteDepth)
        break;
      start -= 1;
    }
    let end = lineNumber;
    while (end < doc.lines) {
      const info = findOrderedAt(end + 1);
      if (!info || info.indentWidth !== anchor.indentWidth || info.quoteDepth !== anchor.quoteDepth)
        break;
      end += 1;
    }
    const changes = [];
    let number = 1;
    for (let i = start; i <= end; i++) {
      const line = doc.line(i);
      const parsed = this.deps.parseLineWithQuote(line.text);
      if (!parsed.isListItem || parsed.markerType !== "ordered" || parsed.indentWidth !== anchor.indentWidth)
        continue;
      const newMarker = `${number}. `;
      const markerStart = line.from + parsed.quotePrefix.length + parsed.indentRaw.length;
      const markerEnd = markerStart + parsed.marker.length;
      changes.push({ from: markerStart, to: markerEnd, insert: newMarker });
      number += 1;
    }
    if (changes.length > 0) {
      view.dispatch({ changes });
    }
  }
};

// src/drag/move/document-change.ts
function resolveInsertionChange(doc, targetLineNumber, insertText, options) {
  var _a;
  if (targetLineNumber <= doc.lines) {
    return {
      pos: doc.line(targetLineNumber).from,
      text: insertText
    };
  }
  const normalized = insertText.endsWith("\n") ? insertText.slice(0, -1) : insertText;
  if (!normalized.length) {
    return { pos: doc.length, text: normalized };
  }
  const remainingLengthAfterDelete = (_a = options == null ? void 0 : options.remainingLengthAfterDelete) != null ? _a : doc.length;
  if (remainingLengthAfterDelete <= 0) {
    return { pos: 0, text: normalized };
  }
  return {
    pos: doc.length,
    text: `
${normalized}`
  };
}
function resolveDeleteRange(doc, sourceFrom, sourceTo) {
  if (sourceTo < doc.length) {
    return {
      from: sourceFrom,
      to: Math.min(sourceTo + 1, doc.length)
    };
  }
  if (sourceFrom > 0) {
    return {
      from: sourceFrom - 1,
      to: sourceTo
    };
  }
  return {
    from: sourceFrom,
    to: sourceTo
  };
}

// src/drag/move/undo-selection-anchor.ts
var import_state2 = require("@codemirror/state");
function anchorSelectionBeforeUndoableChange(view, pos) {
  const docLength = view.state.doc.length;
  const anchor = Math.max(0, Math.min(docLength, pos));
  view.dispatch({
    selection: { anchor },
    scrollIntoView: false,
    annotations: import_state2.Transaction.addToHistory.of(false)
  });
}

// src/drag/move/cross-editor-mover.ts
function moveBlockAcrossEditors(params) {
  const {
    sourceView,
    targetView,
    sourceBlock,
    sourcePayload,
    dropPlan,
    capturedBlockFoldState,
    deps
  } = params;
  if (sourceView === targetView)
    return;
  const targetDoc = targetView.state.doc;
  const targetLineNumber = clampTargetLineNumber(targetDoc.lines, dropPlan.targetLineNumber);
  const lineMap = getLineMap(targetView.state);
  const containerRule = deps.resolveDropRuleAtInsertion(sourceBlock, targetLineNumber, { lineMap });
  if (!containerRule.decision.allowDrop) {
    return;
  }
  const insertText = deps.buildInsertText(
    targetDoc,
    sourceBlock,
    targetLineNumber,
    sourcePayload.content,
    dropPlan.listIntent
  );
  if (!insertText.length) {
    return;
  }
  const insertion = resolveInsertionChange(targetDoc, targetLineNumber, insertText, {
    remainingLengthAfterDelete: targetDoc.length
  });
  anchorSelectionBeforeUndoableChange(targetView, insertion.pos);
  targetView.dispatch({
    changes: { from: insertion.pos, to: insertion.pos, insert: insertion.text },
    scrollIntoView: false
  });
  anchorSelectionBeforeUndoableChange(sourceView, sourceBlock.from);
  sourceView.dispatch({
    changes: sourcePayload.segments.map((segment) => ({ from: segment.deleteFrom, to: segment.deleteTo })).sort((a, b) => b.from - a.from),
    scrollIntoView: false
  });
  finalizeMove({
    sourceView,
    targetView,
    sourceLineNumbers: sourcePayload.segments.map((segment) => segment.startLineNumber),
    targetLineNumbers: [targetLineNumber],
    parseLineWithQuote: deps.parseLineWithQuote,
    restoreTargetBlockFoldState: () => {
      var _a;
      return (_a = deps.blockFoldState) == null ? void 0 : _a.restore(targetView, targetLineNumber, capturedBlockFoldState != null ? capturedBlockFoldState : null);
    }
  });
}
function finalizeMove(params) {
  const {
    sourceView,
    targetView,
    sourceLineNumbers,
    targetLineNumbers,
    parseLineWithQuote: parseLineWithQuote3,
    restoreTargetBlockFoldState
  } = params;
  const sourceRenumberer = new ListRenumberer({ view: sourceView, parseLineWithQuote: parseLineWithQuote3 });
  const targetRenumberer = new ListRenumberer({ view: targetView, parseLineWithQuote: parseLineWithQuote3 });
  const sourceTargets = new Set(sourceLineNumbers);
  const targetTargets = new Set(targetLineNumbers);
  for (const lineNumber of sourceTargets) {
    sourceRenumberer.renumberOrderedListAround(lineNumber);
  }
  for (const lineNumber of targetTargets) {
    targetRenumberer.renumberOrderedListAround(lineNumber);
  }
  restoreTargetBlockFoldState == null ? void 0 : restoreTargetBlockFoldState();
}

// src/drag/move/source-payload.ts
function captureMoveSource(doc, sourceBlock) {
  const payload = captureSourcePayload(doc, sourceBlock);
  if (!payload)
    return null;
  const firstRange = payload.ranges[0];
  const lastRange = payload.ranges[payload.ranges.length - 1];
  const firstLine = doc.line(firstRange.startLine + 1);
  const lastLine = doc.line(lastRange.endLine + 1);
  return {
    block: {
      ...sourceBlock,
      startLine: firstRange.startLine,
      endLine: lastRange.endLine,
      from: firstLine.from,
      to: lastLine.to,
      content: payload.content,
      compositeSelection: { ranges: payload.ranges }
    },
    payload
  };
}
function captureSourcePayload(doc, sourceBlock) {
  var _a, _b;
  const rawRanges = (_b = (_a = sourceBlock.compositeSelection) == null ? void 0 : _a.ranges) != null ? _b : [{
    startLine: sourceBlock.startLine,
    endLine: sourceBlock.endLine
  }];
  const ranges = normalizeCompositeRanges(rawRanges, doc.lines);
  if (ranges.length === 0)
    return null;
  const segments = ranges.map((range) => {
    const startLineNumber = range.startLine + 1;
    const endLineNumber = range.endLine + 1;
    const startLine = doc.line(startLineNumber);
    const endLine = doc.line(endLineNumber);
    const deleteRange = resolveDeleteRange(doc, startLine.from, endLine.to);
    return {
      startLineNumber,
      endLineNumber,
      from: startLine.from,
      to: endLine.to,
      deleteFrom: deleteRange.from,
      deleteTo: deleteRange.to
    };
  });
  const content = segments.map((segment) => doc.sliceString(segment.from, segment.to)).join("\n");
  return { content, ranges, segments };
}

// src/drag/move/block-mover.ts
var BlockMover = class {
  constructor(deps) {
    this.deps = deps;
    this.listRenumberer = new ListRenumberer({
      view: deps.view,
      parseLineWithQuote: deps.parseLineWithQuote
    });
  }
  moveBlock(params) {
    const {
      sourceBlock,
      dropPlan,
      sourceView,
      sourceDocumentRelation,
      capturedBlockFoldStateOverride
    } = params;
    const sourceEditorView = sourceView != null ? sourceView : this.deps.view;
    const sourceDoc = sourceEditorView.state.doc;
    const source = captureMoveSource(sourceDoc, sourceBlock);
    if (!source)
      return;
    if (sourceView && sourceView !== this.deps.view && sourceDocumentRelation !== "same_document") {
      const capturedBlockFoldState2 = capturedBlockFoldStateOverride != null ? capturedBlockFoldStateOverride : this.captureBlockFoldState(sourceView, source.block);
      moveBlockAcrossEditors({
        sourceView,
        targetView: this.deps.view,
        sourceBlock: source.block,
        sourcePayload: source.payload,
        dropPlan,
        capturedBlockFoldState: capturedBlockFoldState2,
        deps: {
          resolveDropRuleAtInsertion: this.deps.resolveDropRuleAtInsertion,
          parseLineWithQuote: this.deps.parseLineWithQuote,
          getListContext: this.deps.getListContext,
          getIndentUnitWidth: this.deps.getIndentUnitWidth,
          buildInsertText: this.deps.buildInsertText,
          blockFoldState: this.deps.blockFoldState
        }
      });
      return;
    }
    const capturedBlockFoldState = capturedBlockFoldStateOverride != null ? capturedBlockFoldStateOverride : this.captureBlockFoldState(sourceEditorView, source.block);
    this.moveCapturedSource({
      source,
      dropPlan,
      capturedBlockFoldState
    });
  }
  moveCapturedSource(params) {
    var _a;
    const { source, dropPlan, capturedBlockFoldState } = params;
    const view = this.deps.view;
    const doc = view.state.doc;
    const { block: sourceBlock, payload } = source;
    const targetLineNumber = clampTargetLineNumber(doc.lines, dropPlan.targetLineNumber);
    const lineMap = getLineMap(view.state);
    const containerRule = this.deps.resolveDropRuleAtInsertion(
      sourceBlock,
      targetLineNumber,
      { lineMap }
    );
    if (!containerRule.decision.allowDrop) {
      return;
    }
    const inPlaceValidation = validateInPlaceDrop({
      doc,
      sourceBlock,
      targetLineNumber,
      parseLineWithQuote: this.deps.parseLineWithQuote,
      getListContext: this.deps.getListContext,
      getIndentUnitWidth: this.deps.getIndentUnitWidth,
      slotContext: containerRule.slotContext,
      lineMap,
      listIntent: dropPlan.listIntent
    });
    const allowInPlaceIndentChange = inPlaceValidation.allowInPlaceIndentChange;
    if (inPlaceValidation.inSelfRange && !allowInPlaceIndentChange) {
      return;
    }
    const insertText = this.deps.buildInsertText(
      doc,
      sourceBlock,
      targetLineNumber,
      payload.content,
      dropPlan.listIntent
    );
    if (!insertText.length)
      return;
    const totalDeletedLength = payload.segments.reduce(
      (sum, segment) => sum + (segment.deleteTo - segment.deleteFrom),
      0
    );
    const insertion = resolveInsertionChange(doc, targetLineNumber, insertText, {
      remainingLengthAfterDelete: doc.length - totalDeletedLength
    });
    if (payload.segments.some((segment) => insertion.pos > segment.deleteFrom && insertion.pos < segment.deleteTo)) {
      return;
    }
    const firstSegment = payload.segments[0];
    anchorSelectionBeforeUndoableChange(view, sourceBlock.from);
    if (allowInPlaceIndentChange && insertion.pos === firstSegment.deleteFrom) {
      view.dispatch({
        changes: { from: firstSegment.deleteFrom, to: firstSegment.deleteTo, insert: insertion.text },
        scrollIntoView: false
      });
    } else {
      view.dispatch({
        changes: [
          { from: insertion.pos, to: insertion.pos, insert: insertion.text },
          ...payload.segments.map((segment) => ({ from: segment.deleteFrom, to: segment.deleteTo }))
        ].sort((a, b) => b.from - a.from),
        scrollIntoView: false
      });
    }
    const targetStartLineNumber = allowInPlaceIndentChange && insertion.pos === firstSegment.deleteFrom ? sourceBlock.startLine + 1 : this.resolveFinalInsertedStartLineNumber(targetLineNumber, payload);
    const renumberTargets = /* @__PURE__ */ new Set([targetLineNumber]);
    for (const segment of payload.segments) {
      renumberTargets.add(segment.startLineNumber);
    }
    for (const lineNumber of renumberTargets) {
      this.listRenumberer.renumberOrderedListAround(lineNumber);
    }
    (_a = this.deps.blockFoldState) == null ? void 0 : _a.restore(view, targetStartLineNumber, capturedBlockFoldState != null ? capturedBlockFoldState : null);
  }
  captureBlockFoldState(sourceView, sourceBlock) {
    var _a, _b;
    return (_b = (_a = this.deps.blockFoldState) == null ? void 0 : _a.capture(sourceView, sourceBlock)) != null ? _b : null;
  }
  resolveFinalInsertedStartLineNumber(targetLineNumber, payload) {
    let removedLineCountBeforeTarget = 0;
    for (const segment of payload.segments) {
      if (segment.endLineNumber < targetLineNumber) {
        removedLineCountBeforeTarget += segment.endLineNumber - segment.startLineNumber + 1;
      }
    }
    return Math.max(1, targetLineNumber - removedLineCountBeforeTarget);
  }
};

// src/drag/drop/drop-indicator.ts
var _DropIndicatorManager = class {
  constructor(view, resolveDropValidation, options) {
    this.view = view;
    this.resolveDropValidation = resolveDropValidation;
    this.options = options;
    this.pendingDragInfo = null;
    this.rafId = null;
    this.lastEvaluatedInput = null;
    this.lastDropPlan = null;
    _DropIndicatorManager.instances.add(this);
    this.indicatorEl = document.createElement("div");
    this.indicatorEl.className = `${DROP_INDICATOR_CLASS} ${HIDDEN_CLASS}`;
    document.body.appendChild(this.indicatorEl);
    this.highlightEl = document.createElement("div");
    this.highlightEl.className = `${DROP_HIGHLIGHT_CLASS} ${HIDDEN_CLASS}`;
    document.body.appendChild(this.highlightEl);
  }
  scheduleFromPoint(clientX, clientY, dragSource, pointerType) {
    this.pendingDragInfo = { x: clientX, y: clientY, dragSource, pointerType };
    if (this.rafId !== null)
      return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      const pending = this.pendingDragInfo;
      if (!pending)
        return;
      this.updateFromPoint(pending);
    });
  }
  hide() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.pendingDragInfo = null;
    this.lastEvaluatedInput = null;
    this.lastDropPlan = null;
    this.indicatorEl.classList.add(HIDDEN_CLASS);
    this.highlightEl.classList.add(HIDDEN_CLASS);
  }
  destroy() {
    this.hide();
    this.indicatorEl.remove();
    this.highlightEl.remove();
    _DropIndicatorManager.instances.delete(this);
  }
  updateFromPoint(info) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    if (this.shouldReuseLastResult(info)) {
      const reused = this.lastDropPlan !== null;
      if (this.lastDropPlan) {
        this.renderDropPlan(this.lastDropPlan);
      } else {
        this.indicatorEl.classList.add(HIDDEN_CLASS);
        this.highlightEl.classList.add(HIDDEN_CLASS);
      }
      (_b = (_a = this.options) == null ? void 0 : _a.onFrameMetrics) == null ? void 0 : _b.call(_a, {
        evaluated: false,
        skipped: true,
        reused,
        durationMs: 0
      });
      return;
    }
    const startedAt = this.now();
    const validation = this.resolveDropValidation({
      clientX: info.x,
      clientY: info.y,
      dragSource: info.dragSource,
      pointerType: info.pointerType
    });
    const dropPlan = validation.allowed ? (_c = validation.plan) != null ? _c : null : null;
    const durationMs = this.now() - startedAt;
    (_e = (_d = this.options) == null ? void 0 : _d.recordPerfDuration) == null ? void 0 : _e.call(_d, "drop_indicator_resolve", durationMs);
    (_g = (_f = this.options) == null ? void 0 : _f.onDropTargetEvaluated) == null ? void 0 : _g.call(_f, {
      sourceBlock: info.dragSource,
      pointerType: info.pointerType,
      validation
    });
    (_i = (_h = this.options) == null ? void 0 : _h.onFrameMetrics) == null ? void 0 : _i.call(_h, {
      evaluated: true,
      skipped: false,
      reused: false,
      durationMs
    });
    this.lastEvaluatedInput = { ...info };
    this.lastDropPlan = dropPlan;
    if (!dropPlan) {
      this.indicatorEl.classList.add(HIDDEN_CLASS);
      this.highlightEl.classList.add(HIDDEN_CLASS);
      return;
    }
    this.renderDropPlan(dropPlan);
  }
  renderDropPlan(dropPlan) {
    var _a, _b;
    this.hideOtherInstancesVisuals();
    const editorRect = this.view.dom.getBoundingClientRect();
    const indicatorY = dropPlan.preview.indicatorY;
    const indicatorLeft = dropPlan.preview.lineRect ? dropPlan.preview.lineRect.left : editorRect.left + 35;
    const contentRect = this.view.contentDOM.getBoundingClientRect();
    const contentPaddingRight = parseFloat(getComputedStyle(this.view.contentDOM).paddingRight) || 0;
    const indicatorRight = contentRect.right - contentPaddingRight;
    const indicatorWidth = Math.max(8, indicatorRight - indicatorLeft);
    this.indicatorEl.classList.remove(HIDDEN_CLASS);
    this.indicatorEl.setCssStyles({
      top: `${indicatorY}px`,
      left: `${indicatorLeft}px`,
      width: `${indicatorWidth}px`
    });
    if (dropPlan.preview.highlightRect && ((_b = (_a = this.options) == null ? void 0 : _a.isDropHighlightEnabled) == null ? void 0 : _b.call(_a)) !== false) {
      this.highlightEl.classList.remove(HIDDEN_CLASS);
      this.highlightEl.setCssStyles({
        top: `${dropPlan.preview.highlightRect.top}px`,
        left: `${dropPlan.preview.highlightRect.left}px`,
        width: `${dropPlan.preview.highlightRect.width}px`,
        height: `${dropPlan.preview.highlightRect.height}px`
      });
    } else {
      this.highlightEl.classList.add(HIDDEN_CLASS);
    }
  }
  hideOtherInstancesVisuals() {
    for (const instance of _DropIndicatorManager.instances) {
      if (instance === this)
        continue;
      instance.hide();
    }
  }
  shouldReuseLastResult(info) {
    if (!this.lastEvaluatedInput)
      return false;
    if (this.lastEvaluatedInput.pointerType !== info.pointerType)
      return false;
    if (!this.isSameSourceBlock(this.lastEvaluatedInput.dragSource, info.dragSource))
      return false;
    const dx = Math.abs(this.lastEvaluatedInput.x - info.x);
    const dy = Math.abs(this.lastEvaluatedInput.y - info.y);
    return dx + dy < 2;
  }
  isSameSourceBlock(a, b) {
    if (a === b)
      return true;
    if (!a || !b)
      return false;
    return a.type === b.type && a.startLine === b.startLine && a.endLine === b.endLine && a.from === b.from && a.to === b.to;
  }
  now() {
    if (typeof performance !== "undefined" && typeof performance.now === "function") {
      return performance.now();
    }
    return Date.now();
  }
};
var DropIndicatorManager = _DropIndicatorManager;
DropIndicatorManager.instances = /* @__PURE__ */ new Set();

// src/drag/drop/rect-calculator.ts
function getCoordsAtPos(view, pos, side) {
  try {
    const { from, to } = view.viewport;
    const margin = 500;
    if (pos >= Math.max(0, from - margin) && pos <= to + margin) {
      return typeof side !== "undefined" ? view.coordsAtPos(pos, side) : view.coordsAtPos(pos);
    }
    const lineBlock = view.lineBlockAt(pos);
    const editorRect = view.dom.getBoundingClientRect();
    const doc = view.state.doc;
    if (pos < 0 || pos > doc.length)
      return null;
    const line = doc.lineAt(pos);
    const col = pos - line.from;
    const defaultCharWidth = view.defaultCharacterWidth || 7;
    const estimatedLeft = editorRect.left + col * defaultCharWidth;
    const estimatedRight = estimatedLeft + defaultCharWidth;
    const documentTop = view.documentTop;
    const screenTop = documentTop + lineBlock.top;
    const screenBottom = documentTop + lineBlock.bottom;
    return {
      left: estimatedLeft,
      right: estimatedRight,
      top: screenTop,
      bottom: screenBottom
    };
  } catch (e) {
    return null;
  }
}
function getLineRect(view, lineNumber) {
  const doc = view.state.doc;
  if (lineNumber < 1 || lineNumber > doc.lines)
    return void 0;
  const line = doc.line(lineNumber);
  const start = getCoordsAtPos(view, line.from);
  const end = getCoordsAtPos(view, line.to);
  if (!start || !end)
    return void 0;
  const left = Math.min(start.left, end.left);
  const right = Math.max(start.left, end.left);
  return { left, width: Math.max(8, right - left) };
}
function getInsertionAnchorY(view, lineNumber) {
  const doc = view.state.doc;
  let y = null;
  if (lineNumber <= 1) {
    const first = doc.line(1);
    const coords = getCoordsAtPos(view, first.from);
    y = coords ? coords.top : null;
  } else {
    const anchorLineNumber = Math.min(lineNumber - 1, doc.lines);
    const anchorLine = doc.line(anchorLineNumber);
    const coords = getCoordsAtPos(view, anchorLine.to);
    y = coords ? coords.bottom : null;
  }
  return y;
}
function getLineIndentPosByWidth(view, lineNumber, targetIndentWidth, tabSize) {
  const doc = view.state.doc;
  if (lineNumber < 1 || lineNumber > doc.lines)
    return null;
  const line = doc.line(lineNumber);
  const text = line.text;
  let width = 0;
  let idx = 0;
  while (idx < text.length && width < targetIndentWidth) {
    const ch = text[idx];
    if (ch === "	") {
      width += tabSize;
    } else if (ch === " ") {
      width += 1;
    } else {
      break;
    }
    idx += 1;
  }
  return line.from + idx;
}
function getBlockRect(view, startLineNumber, endLineNumber) {
  const doc = view.state.doc;
  if (startLineNumber < 1 || endLineNumber > doc.lines)
    return void 0;
  let minLeft = Number.POSITIVE_INFINITY;
  let maxRight = 0;
  let top = 0;
  let bottom = 0;
  for (let i = startLineNumber; i <= endLineNumber; i++) {
    const line = doc.line(i);
    const start = getCoordsAtPos(view, line.from);
    const end = getCoordsAtPos(view, line.to);
    if (!start || !end)
      continue;
    if (i === startLineNumber)
      top = start.top;
    if (i === endLineNumber)
      bottom = end.bottom;
    const left = Math.min(start.left, end.left);
    const right = Math.max(start.left, end.left);
    minLeft = Math.min(minLeft, left);
    maxRight = Math.max(maxRight, right);
  }
  if (!isFinite(minLeft) || maxRight === 0 || bottom <= top)
    return void 0;
  return { top, left: minLeft, width: Math.max(8, maxRight - minLeft), height: bottom - top };
}

// src/platform/dom/embed-probe.ts
function normalizeEmbedRoot(el) {
  var _a;
  if (!el)
    return null;
  return (_a = el.closest(EMBED_ROOT_SELECTOR)) != null ? _a : el;
}
function collectEmbedRoots(view, options) {
  var _a;
  const root = view.dom;
  if (!(root instanceof HTMLElement))
    return [];
  const normalizeToEmbedRoot = (options == null ? void 0 : options.normalizeToEmbedRoot) !== false;
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  const raws = Array.from(root.querySelectorAll(EMBED_BLOCK_SELECTOR));
  for (const raw of raws) {
    const candidate = normalizeToEmbedRoot ? (_a = normalizeEmbedRoot(raw)) != null ? _a : raw : raw;
    if (!root.contains(candidate))
      continue;
    if (seen.has(candidate))
      continue;
    seen.add(candidate);
    result.push(candidate);
  }
  return result;
}
function findEmbedElementAtPoint(view, clientX, clientY, options) {
  var _a;
  const root = view.dom;
  if (!(root instanceof HTMLElement))
    return null;
  const requireDirectWithinRoot = (options == null ? void 0 : options.requireDirectWithinRoot) !== false;
  const normalizeToEmbedRoot = (options == null ? void 0 : options.normalizeToEmbedRoot) !== false;
  if (typeof document.elementFromPoint === "function") {
    const rawEl = document.elementFromPoint(clientX, clientY);
    const el = rawEl instanceof HTMLElement ? rawEl : null;
    if (el) {
      const direct = el.closest(EMBED_BLOCK_SELECTOR);
      if (direct) {
        if (!requireDirectWithinRoot || root.contains(direct)) {
          return normalizeToEmbedRoot ? (_a = normalizeEmbedRoot(direct)) != null ? _a : direct : direct;
        }
      }
    }
  }
  return null;
}

// src/shared/utils/line-number.ts
function clampLineNumber(docLines, lineNumber) {
  if (docLines <= 0)
    return 1;
  if (lineNumber < 1)
    return 1;
  if (lineNumber > docLines)
    return docLines;
  return lineNumber;
}

// src/platform/dom/element-probe.ts
function clamp(value, min, max) {
  if (value < min)
    return min;
  if (value > max)
    return max;
  return value;
}
function safeCoordsAtPos(view, pos, side) {
  return getCoordsAtPos(view, pos, side);
}
function safePosAtCoords(view, coords) {
  try {
    return view.posAtCoords(coords);
  } catch (e) {
    return null;
  }
}
function resolveLineNumberFromPos(view, pos) {
  try {
    return clampLineNumber(view.state.doc.lines, view.state.doc.lineAt(pos).number);
  } catch (e) {
    return null;
  }
}
function resolveLineNumberFromDomNodes(view, probes) {
  const seen = /* @__PURE__ */ new Set();
  for (const probe of probes) {
    if (!probe)
      continue;
    if (seen.has(probe))
      continue;
    seen.add(probe);
    try {
      const pos = view.posAtDOM(probe, 0);
      const lineNumber = resolveLineNumberFromPos(view, pos);
      if (lineNumber !== null)
        return lineNumber;
    } catch (e) {
    }
  }
  return null;
}
function resolveLineNumberFromBlockStartAttribute(view, handle) {
  const startAttr = handle.getAttribute("data-block-start");
  if (startAttr === null)
    return null;
  const lineNumber = Number(startAttr) + 1;
  if (!Number.isInteger(lineNumber))
    return null;
  if (lineNumber < 1 || lineNumber > view.state.doc.lines)
    return null;
  return lineNumber;
}
function resolveLineNumberAtCoords(view, clientX, clientY, contentRect) {
  const clampedX = clamp(clientX, contentRect.left + 2, contentRect.right - 2);
  const pos = safePosAtCoords(view, { x: clampedX, y: clientY });
  if (pos === null)
    return null;
  return resolveLineNumberFromPos(view, pos);
}

// src/platform/dom/line-hit.ts
function getRenderedMainLineElementAtPoint(view, clientX, clientY) {
  if (typeof document.elementFromPoint !== "function")
    return null;
  const rawEl = document.elementFromPoint(clientX, clientY);
  const el = rawEl instanceof HTMLElement ? rawEl : null;
  if (!el)
    return null;
  const lineEl = el.closest(".cm-line");
  if (!lineEl)
    return null;
  if (!view.contentDOM.contains(lineEl))
    return null;
  return lineEl;
}
function getRenderedMainLineNumberAtPoint(view, clientX, clientY) {
  const lineEl = getRenderedMainLineElementAtPoint(view, clientX, clientY);
  if (!lineEl)
    return null;
  try {
    const pos = view.posAtDOM(lineEl, 0);
    const lineNumber = view.state.doc.lineAt(pos).number;
    if (lineNumber < 1 || lineNumber > view.state.doc.lines)
      return null;
    return lineNumber;
  } catch (e) {
    return null;
  }
}

// src/drag/drop/drop-planner.ts
var DropPlanner = class {
  constructor(view, deps) {
    this.view = view;
    this.deps = deps;
    this.lastResolvedCache = null;
    this.listDropPlanner = this.deps.listDropPlanner;
  }
  getDropPlan(info) {
    var _a;
    const validated = this.resolveValidatedDropTarget(info);
    return validated.allowed ? (_a = validated.plan) != null ? _a : null : null;
  }
  resolveValidatedDropTarget(info) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    const startedAt = this.now();
    const dragSource = (_a = info.dragSource) != null ? _a : null;
    const pointerType = (_b = info.pointerType) != null ? _b : null;
    const sourceScope = (_c = info.sourceScope) != null ? _c : "same_editor";
    const cacheKey = this.buildResolveCacheKey(info.clientX, info.clientY, dragSource, pointerType, sourceScope);
    if (this.lastResolvedCache && this.lastResolvedCache.state === this.view.state && this.lastResolvedCache.key === cacheKey) {
      (_e = (_d = this.deps).incrementPerfCounter) == null ? void 0 : _e.call(_d, "resolve_cache_hits", 1);
      const cached = this.lastResolvedCache.result;
      (_g = (_f = this.deps).recordPerfDuration) == null ? void 0 : _g.call(_f, "resolve_total", this.now() - startedAt);
      return cached;
    }
    (_i = (_h = this.deps).incrementPerfCounter) == null ? void 0 : _i.call(_h, "resolve_cache_misses", 1);
    const lineMap = getLineMap(this.view.state);
    const result = this.resolveValidatedDropTargetInternal({
      info,
      dragSource,
      sourceScope,
      lineMap
    });
    this.lastResolvedCache = {
      state: this.view.state,
      key: cacheKey,
      result
    };
    (_k = (_j = this.deps).recordPerfDuration) == null ? void 0 : _k.call(_j, "resolve_total", this.now() - startedAt);
    return result;
  }
  resolveValidatedDropTargetInternal(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    const { info, dragSource, sourceScope, lineMap } = params;
    if (isPointInsideRenderedTableCell(this.view, info.clientX, info.clientY)) {
      return { allowed: false, reason: "table_cell" };
    }
    const embedEl = this.getEmbedElementAtPoint(info.clientX, info.clientY);
    if (embedEl) {
      const block = this.deps.getBlockInfoForEmbed(embedEl);
      if (block) {
        const rect = embedEl.getBoundingClientRect();
        const showAtBottom = info.clientY > rect.top + rect.height / 2;
        const lineNumber = clampTargetLineNumber(
          this.view.state.doc.lines,
          showAtBottom ? block.endLine + 2 : block.startLine + 1
        );
        const containerRule2 = this.resolveContainerRule(dragSource, lineNumber, lineMap);
        if (containerRule2.rejectReason) {
          return {
            allowed: false,
            reason: containerRule2.rejectReason
          };
        }
        const inPlaceRejectReason2 = this.getInPlaceRejectReason({
          dragSource,
          sourceScope,
          targetLineNumber: lineNumber,
          slotContext: containerRule2.slotContext,
          lineMap
        });
        if (inPlaceRejectReason2) {
          return {
            allowed: false,
            reason: inPlaceRejectReason2
          };
        }
        const indicatorY2 = showAtBottom ? rect.bottom : rect.top;
        return this.buildAllowedResult({
          targetLineNumber: lineNumber,
          preview: {
            indicatorY: indicatorY2,
            lineRect: { left: rect.left, width: rect.width }
          }
        });
      }
    }
    const verticalStartedAt = this.now();
    const vertical = this.computeVerticalTarget(info, dragSource);
    (_b = (_a = this.deps).recordPerfDuration) == null ? void 0 : _b.call(_a, "vertical", this.now() - verticalStartedAt);
    if (!vertical) {
      return { allowed: false, reason: "no_target" };
    }
    const containerRule = this.resolveContainerRule(dragSource, vertical.targetLineNumber, lineMap);
    if (containerRule.rejectReason) {
      return {
        allowed: false,
        reason: containerRule.rejectReason
      };
    }
    const listStartedAt = this.now();
    const listTarget = this.listDropPlanner.computeListTarget({
      targetLineNumber: vertical.targetLineNumber,
      lineNumber: vertical.line.number,
      forcedLineNumber: vertical.forcedLineNumber,
      childIntentOnLine: vertical.childIntentOnLine,
      dragSource,
      sourceScope,
      clientX: info.clientX,
      lineMap
    });
    (_d = (_c = this.deps).recordPerfDuration) == null ? void 0 : _d.call(_c, "list_target", this.now() - listStartedAt);
    const inPlaceRejectReason = this.getInPlaceRejectReason({
      dragSource,
      sourceScope,
      targetLineNumber: vertical.targetLineNumber,
      slotContext: containerRule.slotContext,
      listIntent: listTarget.listIntent,
      lineMap
    });
    if (inPlaceRejectReason) {
      return {
        allowed: false,
        reason: inPlaceRejectReason
      };
    }
    const geometryStartedAt = this.now();
    const indicatorY = this.deps.getInsertionAnchorY(vertical.targetLineNumber);
    if (indicatorY === null) {
      (_f = (_e = this.deps).recordPerfDuration) == null ? void 0 : _f.call(_e, "geometry", this.now() - geometryStartedAt);
      return { allowed: false, reason: "no_anchor" };
    }
    const lineRectSourceLineNumber = (_g = listTarget.lineRectSourceLineNumber) != null ? _g : vertical.lineRectSourceLineNumber;
    let lineRect = this.deps.getLineRect(lineRectSourceLineNumber);
    if (typeof ((_h = listTarget.listIntent) == null ? void 0 : _h.targetIndentWidth) === "number") {
      const indentPos = this.deps.getLineIndentPosByWidth(lineRectSourceLineNumber, listTarget.listIntent.targetIndentWidth);
      if (indentPos !== null) {
        const start = getCoordsAtPos(this.view, indentPos);
        const end = getCoordsAtPos(this.view, this.view.state.doc.line(lineRectSourceLineNumber).to);
        if (start && end) {
          const left = start.left;
          const width = Math.max(8, ((_i = end.right) != null ? _i : end.left) - left);
          lineRect = { left, width };
        }
      }
    }
    (_k = (_j = this.deps).recordPerfDuration) == null ? void 0 : _k.call(_j, "geometry", this.now() - geometryStartedAt);
    return this.buildAllowedResult({
      targetLineNumber: vertical.targetLineNumber,
      listIntent: listTarget.listIntent,
      preview: {
        indicatorY,
        lineRect,
        highlightRect: listTarget.highlightRect
      }
    });
  }
  buildAllowedResult(plan) {
    return {
      allowed: true,
      plan
    };
  }
  resolveContainerRule(dragSource, targetLineNumber, lineMap) {
    var _a, _b, _c;
    const containerStartedAt = this.now();
    const containerRule = dragSource ? this.deps.resolveDropRuleAtInsertion(dragSource, targetLineNumber, { lineMap }) : null;
    (_b = (_a = this.deps).recordPerfDuration) == null ? void 0 : _b.call(_a, "container", this.now() - containerStartedAt);
    if (!containerRule) {
      return { slotContext: null, rejectReason: null };
    }
    if (containerRule.decision.allowDrop) {
      return { slotContext: containerRule.slotContext, rejectReason: null };
    }
    return {
      slotContext: containerRule.slotContext,
      rejectReason: (_c = containerRule.decision.rejectReason) != null ? _c : "container_policy"
    };
  }
  getInPlaceRejectReason(params) {
    var _a, _b, _c;
    const {
      dragSource,
      sourceScope,
      targetLineNumber,
      slotContext,
      lineMap,
      listIntent
    } = params;
    if (!dragSource || sourceScope === "cross_editor")
      return null;
    const inPlaceStartedAt = this.now();
    const inPlaceValidation = validateInPlaceDrop({
      doc: this.view.state.doc,
      sourceBlock: dragSource,
      targetLineNumber,
      parseLineWithQuote: this.deps.parseLineWithQuote,
      getListContext: this.deps.getListContext,
      getIndentUnitWidth: this.deps.getIndentUnitWidth,
      slotContext: slotContext != null ? slotContext : void 0,
      listIntent,
      lineMap
    });
    (_b = (_a = this.deps).recordPerfDuration) == null ? void 0 : _b.call(_a, "in_place", this.now() - inPlaceStartedAt);
    if (inPlaceValidation.inSelfRange && !inPlaceValidation.allowInPlaceIndentChange) {
      return (_c = inPlaceValidation.rejectReason) != null ? _c : "self_range_blocked";
    }
    if (!inPlaceValidation.inSelfRange && inPlaceValidation.rejectReason) {
      return inPlaceValidation.rejectReason;
    }
    return null;
  }
  computeVerticalTarget(info, dragSource) {
    const contentRect = this.view.contentDOM.getBoundingClientRect();
    let lineNumber = getRenderedMainLineNumberAtPoint(this.view, info.clientX, info.clientY);
    if (lineNumber === null) {
      lineNumber = resolveLineNumberAtCoords(this.view, info.clientX, info.clientY, contentRect);
      if (lineNumber === null)
        return null;
    }
    const line = this.view.state.doc.line(lineNumber);
    const allowListChildIntent = !!dragSource && dragSource.type === "list-item" /* ListItem */;
    const lineBoundsForSnap = this.listDropPlanner.getListMarkerBounds(line.number);
    const lineParsedForSnap = this.deps.parseLineWithQuote(line.text);
    const childIntentOnLine = allowListChildIntent && !!lineBoundsForSnap && lineParsedForSnap.isListItem && info.clientX >= lineBoundsForSnap.contentStartX + 2;
    const adjustedTarget = this.deps.getAdjustedTargetLocation(line.number, {
      clientY: info.clientY
    });
    let forcedLineNumber = adjustedTarget.blockAdjusted ? adjustedTarget.lineNumber : null;
    let showAtBottom = false;
    if (!forcedLineNumber) {
      const isBlankLine = line.text.trim().length === 0;
      if (isBlankLine) {
        const visualMidY = this.getVisualLineMidY(line.number, line.from);
        if (visualMidY !== null) {
          forcedLineNumber = info.clientY > visualMidY ? line.number + 1 : line.number;
        } else {
          const lineStart = getCoordsAtPos(this.view, line.from);
          const lineEnd = getCoordsAtPos(this.view, line.to);
          if (lineStart && lineEnd) {
            const midY = (lineStart.top + lineEnd.bottom) / 2;
            forcedLineNumber = info.clientY > midY ? line.number + 1 : line.number;
          } else {
            forcedLineNumber = line.number;
          }
        }
      } else {
        showAtBottom = true;
        const visualMidY = this.getVisualLineMidY(line.number, line.from);
        if (visualMidY !== null) {
          showAtBottom = info.clientY > visualMidY;
        } else {
          const lineStart = getCoordsAtPos(this.view, line.from);
          const lineEnd = getCoordsAtPos(this.view, line.to);
          if (lineStart && lineEnd) {
            const midY = (lineStart.top + lineEnd.bottom) / 2;
            showAtBottom = info.clientY > midY;
          }
        }
      }
    }
    let targetLineNumber = clampTargetLineNumber(
      this.view.state.doc.lines,
      forcedLineNumber != null ? forcedLineNumber : showAtBottom ? line.number + 1 : line.number
    );
    if (!forcedLineNumber && childIntentOnLine && !showAtBottom) {
      targetLineNumber = clampTargetLineNumber(this.view.state.doc.lines, line.number + 1);
    }
    return {
      line,
      targetLineNumber,
      forcedLineNumber,
      childIntentOnLine,
      lineRectSourceLineNumber: line.number
    };
  }
  getVisualLineMidY(lineNumber, lineFromPos) {
    try {
      const block = this.view.lineBlockAt(lineFromPos);
      return this.view.documentTop + (block.top + block.bottom) / 2;
    } catch (e) {
      return null;
    }
  }
  getEmbedElementAtPoint(clientX, clientY) {
    return findEmbedElementAtPoint(this.view, clientX, clientY, {
      requireDirectWithinRoot: false,
      normalizeToEmbedRoot: true
    });
  }
  buildResolveCacheKey(clientX, clientY, dragSource, pointerType, sourceScope) {
    var _a, _b;
    if (!dragSource) {
      return `${clientX}|${clientY}|none|${pointerType != null ? pointerType : ""}|${sourceScope}`;
    }
    const compositeKey = ((_b = (_a = dragSource.compositeSelection) == null ? void 0 : _a.ranges) != null ? _b : []).map((range) => `${range.startLine}-${range.endLine}`).join(",");
    return [
      clientX,
      clientY,
      pointerType != null ? pointerType : "",
      sourceScope,
      dragSource.type,
      dragSource.startLine,
      dragSource.endLine,
      dragSource.from,
      dragSource.to,
      compositeKey
    ].join("|");
  }
  now() {
    if (typeof performance !== "undefined" && typeof performance.now === "function") {
      return performance.now();
    }
    return Date.now();
  }
};

// src/drag/gesture/range-selection/block-selection.ts
function clamp2(value, min, max) {
  if (value < min)
    return min;
  if (value > max)
    return max;
  return value;
}
function keyForBlockRange(range) {
  return `${range.startLineNumber}:${range.endLineNumber}`;
}
function normalizeSelectedBlockRange(docLines, startLineNumber, endLineNumber) {
  const safeStart = clamp2(Math.min(startLineNumber, endLineNumber), 1, docLines);
  const safeEnd = clamp2(Math.max(startLineNumber, endLineNumber), safeStart, docLines);
  return {
    startLineNumber: safeStart,
    endLineNumber: safeEnd
  };
}
function cloneSelectedBlocks(blocks) {
  return blocks.map((block) => ({
    startLineNumber: block.startLineNumber,
    endLineNumber: block.endLineNumber
  }));
}
function mergeSelectedBlocks(docLines, blocks) {
  const normalized = blocks.map((block) => normalizeSelectedBlockRange(docLines, block.startLineNumber, block.endLineNumber)).sort((a, b) => a.startLineNumber - b.startLineNumber || a.endLineNumber - b.endLineNumber);
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const block of normalized) {
    const key = keyForBlockRange(block);
    if (seen.has(key))
      continue;
    seen.add(key);
    result.push(block);
  }
  return result;
}
function subtractSelectedBlocks(docLines, sourceBlocks, blocksToRemove) {
  const removeKeys = new Set(
    mergeSelectedBlocks(docLines, blocksToRemove).map((block) => keyForBlockRange(block))
  );
  return mergeSelectedBlocks(docLines, sourceBlocks).filter((block) => !removeKeys.has(keyForBlockRange(block)));
}
function isSelectedBlockCoveredByBlocks(docLines, target, blocks) {
  const normalizedTarget = normalizeSelectedBlockRange(
    docLines,
    target.startLineNumber,
    target.endLineNumber
  );
  const targetKey = keyForBlockRange(normalizedTarget);
  return mergeSelectedBlocks(docLines, blocks).some((block) => keyForBlockRange(block) === targetKey);
}
function groupSelectedBlocksIntoSegments(docLines, blocks) {
  return groupSegments(mergeSelectedBlocks(docLines, blocks));
}
function groupSegments(normalized) {
  if (normalized.length === 0)
    return [];
  const segments = [];
  let current = {
    startLineNumber: normalized[0].startLineNumber,
    endLineNumber: normalized[0].endLineNumber,
    startBlockLineNumber: normalized[0].startLineNumber,
    endBlockLineNumber: normalized[0].startLineNumber
  };
  for (let i = 1; i < normalized.length; i++) {
    const block = normalized[i];
    if (block.startLineNumber <= current.endLineNumber + 1) {
      current.endLineNumber = Math.max(current.endLineNumber, block.endLineNumber);
      current.endBlockLineNumber = block.startLineNumber;
      continue;
    }
    segments.push(current);
    current = {
      startLineNumber: block.startLineNumber,
      endLineNumber: block.endLineNumber,
      startBlockLineNumber: block.startLineNumber,
      endBlockLineNumber: block.startLineNumber
    };
  }
  segments.push(current);
  return segments;
}

// src/drag/gesture/range-selection/selection-anchor.ts
function getHandleBlockLineNumber(handle) {
  const blockStartAttr = handle.getAttribute("data-block-start");
  if (!blockStartAttr)
    return null;
  const blockStart = Number(blockStartAttr);
  if (!Number.isFinite(blockStart))
    return null;
  return blockStart + 1;
}
function getAnchorPointForHandle(handle) {
  var _a, _b;
  if (!handle)
    return null;
  const host = (_a = handle.closest(`${CODEMIRROR_GUTTER_ELEMENT_SELECTOR}.${HANDLE_GUTTER_MARKER_CLASS}`)) != null ? _a : handle.closest(`.${HANDLE_GUTTER_MARKER_CLASS}`);
  if (!host)
    return null;
  const anchorTarget = (_b = handle.querySelector(`.${HANDLE_CORE_CLASS}`)) != null ? _b : handle;
  const rect = anchorTarget.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0)
    return null;
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    host
  };
}
function getAnchorPointByBlockLineNumber(blockLineNumber, resolveHandleForBlockLineNumber) {
  const handle = resolveHandleForBlockLineNumber(blockLineNumber);
  return getAnchorPointForHandle(handle);
}
function emptyAnchorSnapshot() {
  return {
    ordered: [],
    byBlockLineNumber: /* @__PURE__ */ new Map()
  };
}
function buildAnchorSnapshot(visibleHandles) {
  const snapshot = emptyAnchorSnapshot();
  for (const handle of visibleHandles) {
    const blockLineNumber = getHandleBlockLineNumber(handle);
    if (blockLineNumber === null)
      continue;
    if (snapshot.byBlockLineNumber.has(blockLineNumber))
      continue;
    const anchor = getAnchorPointForHandle(handle);
    if (!anchor)
      continue;
    snapshot.byBlockLineNumber.set(blockLineNumber, anchor);
    snapshot.ordered.push({ blockLineNumber, anchor });
  }
  snapshot.ordered.sort((a, b) => a.blockLineNumber - b.blockLineNumber);
  return snapshot;
}
function findFirstAnchorIndexAtOrAfter(ordered, startBlockLineNumber) {
  let low = 0;
  let high = ordered.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (ordered[mid].blockLineNumber < startBlockLineNumber) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}
function resolveAnchorSpan(options) {
  var _a, _b;
  const anchors = [];
  const seenHosts = /* @__PURE__ */ new Set();
  const addAnchor = (anchor) => {
    if (!anchor)
      return;
    if (seenHosts.has(anchor.host))
      return;
    seenHosts.add(anchor.host);
    anchors.push(anchor);
  };
  const startAnchor = (_a = options.snapshot.byBlockLineNumber.get(options.segment.startBlockLineNumber)) != null ? _a : options.resolveHandleForBlockLineNumber ? getAnchorPointByBlockLineNumber(
    options.segment.startBlockLineNumber,
    options.resolveHandleForBlockLineNumber
  ) : null;
  const endAnchor = (_b = options.snapshot.byBlockLineNumber.get(options.segment.endBlockLineNumber)) != null ? _b : options.resolveHandleForBlockLineNumber ? getAnchorPointByBlockLineNumber(
    options.segment.endBlockLineNumber,
    options.resolveHandleForBlockLineNumber
  ) : null;
  addAnchor(startAnchor);
  addAnchor(endAnchor);
  const ordered = options.snapshot.ordered;
  for (let i = findFirstAnchorIndexAtOrAfter(ordered, options.segment.startBlockLineNumber); i < ordered.length && ordered[i].blockLineNumber <= options.segment.endBlockLineNumber; i++) {
    addAnchor(ordered[i].anchor);
  }
  if (anchors.length === 0)
    return null;
  const topAnchor = anchors.reduce((best, current) => current.y < best.y ? current : best);
  const bottomAnchor = anchors.reduce((best, current) => current.y > best.y ? current : best);
  return {
    x: (topAnchor.x + bottomAnchor.x) / 2,
    topY: topAnchor.y,
    bottomY: bottomAnchor.y,
    host: topAnchor.host
  };
}

// src/drag/gesture/range-selection/editor-local-coordinates.ts
function getEditorAxisScale(rectSize, offsetSize) {
  if (rectSize <= 0 || offsetSize <= 0)
    return 1;
  return rectSize / offsetSize;
}
function viewportXToEditorLocalX(view, viewportX) {
  const rect = view.dom.getBoundingClientRect();
  const scaleX = getEditorAxisScale(rect.width, view.dom.offsetWidth);
  return (viewportX - rect.left) / scaleX - view.dom.clientLeft;
}
function viewportYToEditorLocalY(view, viewportY) {
  const rect = view.dom.getBoundingClientRect();
  const scaleY = getEditorAxisScale(rect.height, view.dom.offsetHeight);
  return (viewportY - rect.top) / scaleY - view.dom.clientTop;
}

// src/drag/gesture/range-selection/selection-overlay-renderer.ts
var RangeSelectionOverlayRenderer = class {
  constructor(view) {
    this.view = view;
    this.topResizeHandleEl = this.createResizeHandle("top");
    this.bottomResizeHandleEl = this.createResizeHandle("bottom");
  }
  render(blocks, segments, resolveRangeAnchorSpan, options) {
    var _a, _b;
    const hostOriginCache = /* @__PURE__ */ new WeakMap();
    const getHostOrigin = (host) => {
      const cached = hostOriginCache.get(host);
      if (cached)
        return cached;
      const hostRect = host.getBoundingClientRect();
      const origin = {
        x: viewportXToEditorLocalX(this.view, hostRect.left),
        y: viewportYToEditorLocalY(this.view, hostRect.top)
      };
      hostOriginCache.set(host, origin);
      return origin;
    };
    const viewportXToHostLocalX = (host, viewportX) => viewportXToEditorLocalX(this.view, viewportX) - getHostOrigin(host).x;
    const viewportYToHostLocalY = (host, viewportY) => viewportYToEditorLocalY(this.view, viewportY) - getHostOrigin(host).y;
    for (const segment of segments) {
      resolveRangeAnchorSpan(segment);
    }
    const mobileResizeAnchors = (options == null ? void 0 : options.showMobileResizeHandles) ? this.resolveMobileResizeAnchors(blocks) : null;
    this.renderResizeHandle(this.topResizeHandleEl, (_a = mobileResizeAnchors == null ? void 0 : mobileResizeAnchors.top) != null ? _a : null, viewportXToHostLocalX, viewportYToHostLocalY, !!(options == null ? void 0 : options.showMobileResizeHandles));
    this.renderResizeHandle(this.bottomResizeHandleEl, (_b = mobileResizeAnchors == null ? void 0 : mobileResizeAnchors.bottom) != null ? _b : null, viewportXToHostLocalX, viewportYToHostLocalY, !!(options == null ? void 0 : options.showMobileResizeHandles));
  }
  clear() {
    this.topResizeHandleEl.classList.remove("is-active");
    this.bottomResizeHandleEl.classList.remove("is-active");
  }
  destroy() {
    this.clear();
    this.topResizeHandleEl.remove();
    this.bottomResizeHandleEl.remove();
  }
  renderResizeHandle(handleEl, anchor, viewportXToHostLocalX, viewportYToHostLocalY, shouldRender) {
    if (!anchor || !shouldRender || !this.isMobileEnvironment()) {
      handleEl.classList.remove("is-active");
      return;
    }
    if (handleEl.parentElement !== anchor.host) {
      anchor.host.appendChild(handleEl);
    }
    const left = viewportXToHostLocalX(anchor.host, anchor.x) - 32;
    const top = viewportYToHostLocalY(anchor.host, anchor.y) - 18;
    handleEl.classList.add("is-active");
    handleEl.setCssStyles({
      left: `${left.toFixed(2)}px`,
      top: `${top.toFixed(2)}px`
    });
  }
  resolveMobileResizeAnchors(blocks) {
    var _a;
    if (blocks.length === 0)
      return null;
    const doc = this.view.state.doc;
    const firstLineNumber = Math.min(...blocks.map((block) => block.startLineNumber));
    const lastLineNumber = Math.max(...blocks.map((block) => block.endLineNumber));
    if (firstLineNumber < 1 || lastLineNumber > doc.lines)
      return null;
    const firstLine = doc.line(firstLineNumber);
    const lastLine = doc.line(lastLineNumber);
    const topCoords = safeCoordsAtPos(this.view, firstLine.from, 1);
    const bottomCoords = (_a = safeCoordsAtPos(this.view, lastLine.to, -1)) != null ? _a : safeCoordsAtPos(this.view, lastLine.from, 1);
    if (!topCoords || !bottomCoords)
      return null;
    const x = this.resolveSelectionCenterX();
    const host = this.view.dom;
    return {
      top: { y: topCoords.top, x, host },
      bottom: { y: bottomCoords.bottom, x, host }
    };
  }
  resolveSelectionCenterX() {
    const contentRect = this.view.contentDOM.getBoundingClientRect();
    if (Number.isFinite(contentRect.left) && Number.isFinite(contentRect.right) && contentRect.right > contentRect.left) {
      return (contentRect.left + contentRect.right) / 2;
    }
    const editorRect = this.view.dom.getBoundingClientRect();
    return (editorRect.left + editorRect.right) / 2;
  }
  createResizeHandle(position) {
    const handle = document.createElement("div");
    handle.className = `${MOBILE_SELECTION_RESIZE_HANDLE_CLASS} ${position === "top" ? MOBILE_SELECTION_RESIZE_HANDLE_TOP_CLASS : MOBILE_SELECTION_RESIZE_HANDLE_BOTTOM_CLASS}`;
    handle.textContent = "\u283F";
    handle.setAttribute("data-dnd-mobile-selection-handle", position);
    handle.setAttribute("aria-label", position === "top" ? "Adjust selection start" : "Adjust selection end");
    return handle;
  }
  isMobileEnvironment() {
    const body = document.body;
    if (body.classList.contains("is-mobile") || body.classList.contains("is-phone") || body.classList.contains("is-tablet")) {
      return true;
    }
    if (typeof window.matchMedia !== "function")
      return false;
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  }
};

// src/drag/gesture/range-selection/selection-visual-manager.ts
var _RangeSelectionVisualManager = class {
  constructor(view, onRefreshRequested, resolveVisibleHandleForBlockStart, _onSelectionAction) {
    this.view = view;
    this.onRefreshRequested = onRefreshRequested;
    this.resolveVisibleHandleForBlockStart = resolveVisibleHandleForBlockStart;
    this.handleElements = /* @__PURE__ */ new Set();
    this.selectedLineElements = /* @__PURE__ */ new Set();
    this.handleAnchorSnapshot = emptyAnchorSnapshot();
    this.refreshRafHandle = null;
    this.scrollContainer = null;
    this.overlayRenderer = new RangeSelectionOverlayRenderer(
      this.view
    );
    this.onScroll = () => this.scheduleRefresh();
    this.bindScrollListener();
  }
  render(blocks, options) {
    const normalizedBlocks = mergeSelectedBlocks(this.view.state.doc.lines, blocks);
    const segments = groupSegments(normalizedBlocks);
    const nextHandleElements = /* @__PURE__ */ new Set();
    const nextLineElements = /* @__PURE__ */ new Set();
    for (const block of normalizedBlocks) {
      const handleEl = this.resolveHandleElementForBlockStart(block.startLineNumber - 1);
      if (handleEl) {
        nextHandleElements.add(handleEl);
      }
      if (options == null ? void 0 : options.highlightLines) {
        for (let lineNumber = block.startLineNumber; lineNumber <= block.endLineNumber; lineNumber++) {
          const lineEl = this.resolveLineElement(lineNumber);
          if (lineEl)
            nextLineElements.add(lineEl);
        }
      }
    }
    this.handleAnchorSnapshot = buildAnchorSnapshot(nextHandleElements);
    this.syncSelectionElements(
      this.handleElements,
      nextHandleElements,
      RANGE_SELECTED_HANDLE_CLASS
    );
    this.syncSelectionElements(
      this.selectedLineElements,
      nextLineElements,
      RANGE_SELECTED_LINE_CLASS
    );
    this.overlayRenderer.render(normalizedBlocks, segments, (segment) => this.resolveRangeAnchorSpan(segment), {
      showMobileResizeHandles: options == null ? void 0 : options.showMobileResizeHandles
    });
  }
  clear() {
    for (const handleEl of this.handleElements) {
      handleEl.classList.remove(RANGE_SELECTED_HANDLE_CLASS);
      this.removeSelectionCheckbox(handleEl);
    }
    for (const lineEl of this.selectedLineElements) {
      lineEl.classList.remove(RANGE_SELECTED_LINE_CLASS);
    }
    this.handleElements.clear();
    this.selectedLineElements.clear();
    this.handleAnchorSnapshot = emptyAnchorSnapshot();
    this.overlayRenderer.clear();
  }
  scheduleRefresh() {
    if (this.refreshRafHandle !== null)
      return;
    this.refreshRafHandle = window.requestAnimationFrame(() => {
      this.refreshRafHandle = null;
      this.onRefreshRequested();
    });
  }
  cancelScheduledRefresh() {
    if (this.refreshRafHandle === null)
      return;
    window.cancelAnimationFrame(this.refreshRafHandle);
    this.refreshRafHandle = null;
  }
  destroy() {
    this.clear();
    this.overlayRenderer.destroy();
    this.cancelScheduledRefresh();
    this.unbindScrollListener();
  }
  bindScrollListener() {
    var _a, _b;
    this.unbindScrollListener();
    const scroller = (_b = (_a = this.view.scrollDOM) != null ? _a : this.view.dom.querySelector(".cm-scroller")) != null ? _b : null;
    if (!scroller)
      return;
    scroller.addEventListener("scroll", this.onScroll, { passive: true });
    this.scrollContainer = scroller;
  }
  unbindScrollListener() {
    if (!this.scrollContainer)
      return;
    this.scrollContainer.removeEventListener("scroll", this.onScroll);
    this.scrollContainer = null;
  }
  syncSelectionElements(current, next, className) {
    for (const el of current) {
      if (next.has(el)) {
        el.classList.add(className);
        if (className === RANGE_SELECTED_HANDLE_CLASS) {
          this.ensureSelectionCheckbox(el);
        }
        continue;
      }
      el.classList.remove(className);
      if (className === RANGE_SELECTED_HANDLE_CLASS) {
        this.removeSelectionCheckbox(el);
      }
    }
    for (const el of next) {
      if (current.has(el))
        continue;
      el.classList.add(className);
      if (className === RANGE_SELECTED_HANDLE_CLASS) {
        this.ensureSelectionCheckbox(el);
      }
    }
    current.clear();
    for (const el of next) {
      current.add(el);
    }
  }
  ensureSelectionCheckbox(handleEl) {
    const existing = handleEl.querySelector(`:scope > .${_RangeSelectionVisualManager.selectedCheckboxClass}`);
    if (existing) {
      existing.checked = true;
      return;
    }
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.tabIndex = -1;
    checkbox.className = _RangeSelectionVisualManager.selectedCheckboxClass;
    checkbox.setAttribute("aria-hidden", "true");
    handleEl.appendChild(checkbox);
  }
  removeSelectionCheckbox(handleEl) {
    const checkbox = handleEl.querySelector(`:scope > .${_RangeSelectionVisualManager.selectedCheckboxClass}`);
    checkbox == null ? void 0 : checkbox.remove();
  }
  resolveHandleElementForBlockStart(blockStart) {
    var _a, _b;
    const mapped = this.resolveVisibleHandleForBlockStart(blockStart);
    if (mapped)
      return mapped;
    const selector = `.${DRAG_HANDLE_CLASS}[data-block-start="${blockStart}"]`;
    const handles = Array.from(this.view.dom.querySelectorAll(selector));
    if (handles.length === 0)
      return null;
    return (_b = (_a = handles.find((handle) => !handle.classList.contains(EMBED_HANDLE_CLASS))) != null ? _a : handles[0]) != null ? _b : null;
  }
  resolveLineElement(lineNumber) {
    var _a;
    if (lineNumber < 1 || lineNumber > this.view.state.doc.lines)
      return null;
    const line = this.view.state.doc.line(lineNumber);
    const domAtPos = this.view.domAtPos(line.from);
    const node = domAtPos.node instanceof HTMLElement ? domAtPos.node : domAtPos.node.parentElement;
    return (_a = node == null ? void 0 : node.closest(".cm-line")) != null ? _a : null;
  }
  resolveRangeAnchorSpan(segment) {
    return resolveAnchorSpan({
      segment,
      snapshot: this.handleAnchorSnapshot,
      resolveHandleForBlockLineNumber: (lineNumber) => this.resolveHandleElementForBlockStart(lineNumber - 1)
    });
  }
};
var RangeSelectionVisualManager = _RangeSelectionVisualManager;
RangeSelectionVisualManager.selectedCheckboxClass = "dnd-selection-checkbox";

// src/shared/dom-attrs.ts
var DND_DRAG_SOURCE_STYLE_ATTR = "data-dnd-drag-source-style";
var DND_DRAG_SOURCE_HIGHLIGHT_ATTR = "data-dnd-drag-source-highlight";
var DND_LIST_DROP_HIGHLIGHT_ATTR = "data-dnd-list-drop-highlight";
var DND_HANDLE_ICON_ATTR = "data-dnd-handle-icon";
var DND_MOBILE_GESTURE_LOCK_COUNT_ATTR = "data-dnd-mobile-lock-count";

// src/drag/gesture/mobile-gesture-controller.ts
var MOBILE_DRAG_HOTZONE_EXTRA_LEFT_TOLERANCE_PX = 16;
var MOBILE_LINE_HIT_Y_TOLERANCE_PX = 8;
var MOBILE_EMBED_HIT_PADDING_PX = 6;
var MOBILE_RANGE_SELECT_SCROLL_CANCEL_THRESHOLD_PX = 14;
var MobileGestureController = class {
  constructor(view, onFocusIn) {
    this.view = view;
    this.mobileInteractionLocked = false;
    this.focusGuardAttached = false;
    this.savedContentEditable = null;
    this.onDocumentFocusIn = onFocusIn;
  }
  isMobileEnvironment() {
    const body = document.body;
    if ((body == null ? void 0 : body.classList.contains("is-mobile")) || (body == null ? void 0 : body.classList.contains("is-phone")) || (body == null ? void 0 : body.classList.contains("is-tablet"))) {
      return true;
    }
    if (typeof window === "undefined" || typeof window.matchMedia !== "function")
      return false;
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  }
  isWithinContentTolerance(clientX) {
    const contentRect = this.view.contentDOM.getBoundingClientRect();
    const left = contentRect.left - MOBILE_DRAG_HOTZONE_EXTRA_LEFT_TOLERANCE_PX;
    const right = contentRect.right + MOBILE_DRAG_HOTZONE_EXTRA_LEFT_TOLERANCE_PX;
    return clientX >= left && clientX <= right;
  }
  isWithinEditorTolerance(clientX) {
    const editorRect = this.view.dom.getBoundingClientRect();
    const left = editorRect.left - MOBILE_DRAG_HOTZONE_EXTRA_LEFT_TOLERANCE_PX;
    const right = editorRect.right + MOBILE_DRAG_HOTZONE_EXTRA_LEFT_TOLERANCE_PX;
    return clientX >= left && clientX <= right;
  }
  isWithinMobileTextLineOrEmbedArea(target, clientX, clientY) {
    const embedEl = this.resolveEmbedElement(target, clientX, clientY);
    if (embedEl) {
      return this.isWithinEmbedDragArea(embedEl, clientX, clientY);
    }
    if (!target)
      return false;
    const lineEl = target.closest(".cm-line");
    if (lineEl && this.view.contentDOM.contains(lineEl)) {
      const lineNumber = this.resolveLineNumberFromTarget(target, lineEl);
      if (lineNumber !== null) {
        return this.isWithinLineDragArea(lineNumber, clientX, clientY);
      }
    }
    if (!this.view.contentDOM.contains(target))
      return false;
    const fallbackLineNumber = this.resolveLineNumberFromTarget(target, null);
    if (fallbackLineNumber !== null) {
      return this.isWithinLineDragArea(fallbackLineNumber, clientX, clientY);
    }
    return false;
  }
  isMostlyVerticalScrollGesture(dx, dy) {
    return Math.abs(dy) > MOBILE_RANGE_SELECT_SCROLL_CANCEL_THRESHOLD_PX && Math.abs(dy) > Math.abs(dx) * 1.4;
  }
  lockMobileInteraction() {
    if (this.mobileInteractionLocked)
      return;
    const body = document.body;
    const current = Number(body.getAttribute(DND_MOBILE_GESTURE_LOCK_COUNT_ATTR) || "0");
    const next = current + 1;
    body.setAttribute(DND_MOBILE_GESTURE_LOCK_COUNT_ATTR, String(next));
    body.classList.add(MOBILE_GESTURE_LOCK_CLASS);
    this.savedContentEditable = this.view.contentDOM.getAttribute("contenteditable");
    this.view.contentDOM.setAttribute("contenteditable", "false");
    this.view.dom.classList.add(MOBILE_GESTURE_LOCK_CLASS);
    this.mobileInteractionLocked = true;
  }
  unlockMobileInteraction() {
    if (!this.mobileInteractionLocked)
      return;
    const body = document.body;
    const current = Number(body.getAttribute(DND_MOBILE_GESTURE_LOCK_COUNT_ATTR) || "0");
    const next = Math.max(0, current - 1);
    if (next === 0) {
      body.removeAttribute(DND_MOBILE_GESTURE_LOCK_COUNT_ATTR);
      body.classList.remove(MOBILE_GESTURE_LOCK_CLASS);
    } else {
      body.setAttribute(DND_MOBILE_GESTURE_LOCK_COUNT_ATTR, String(next));
    }
    if (this.savedContentEditable === null) {
      this.view.contentDOM.removeAttribute("contenteditable");
    } else {
      this.view.contentDOM.setAttribute("contenteditable", this.savedContentEditable);
    }
    this.savedContentEditable = null;
    this.view.dom.classList.remove(MOBILE_GESTURE_LOCK_CLASS);
    this.mobileInteractionLocked = false;
  }
  suppressMobileKeyboard(target) {
    var _a;
    const rawActive = target instanceof HTMLElement ? target : document.activeElement;
    const active = rawActive instanceof HTMLElement ? rawActive : null;
    if (!active)
      return;
    if (!this.shouldSuppressFocusTarget(active))
      return;
    if (typeof active.blur === "function") {
      active.blur();
    }
    if (typeof window.getSelection === "function") {
      try {
        (_a = window.getSelection()) == null ? void 0 : _a.removeAllRanges();
      } catch (e) {
      }
    }
  }
  shouldSuppressFocusTarget(target) {
    const isInputControl = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable;
    const isEditorContent = target.classList.contains("cm-content") || !!target.closest(".cm-content");
    return isInputControl || isEditorContent;
  }
  attachFocusGuard() {
    if (this.focusGuardAttached)
      return;
    document.addEventListener("focusin", this.onDocumentFocusIn, true);
    this.focusGuardAttached = true;
  }
  detachFocusGuard() {
    if (!this.focusGuardAttached)
      return;
    document.removeEventListener("focusin", this.onDocumentFocusIn, true);
    this.focusGuardAttached = false;
  }
  triggerMobileHapticFeedback() {
    const nav = navigator;
    if (typeof nav.vibrate !== "function")
      return;
    try {
      nav.vibrate(10);
    } catch (e) {
    }
  }
  resolveLineNumberFromTarget(target, lineEl) {
    const probes = [target];
    if (lineEl)
      probes.push(lineEl);
    if (target.firstChild)
      probes.push(target.firstChild);
    if (lineEl == null ? void 0 : lineEl.firstChild)
      probes.push(lineEl.firstChild);
    return resolveLineNumberFromDomNodes(this.view, probes);
  }
  isWithinLineDragArea(lineNumber, clientX, clientY) {
    if (!this.isWithinContentTolerance(clientX))
      return false;
    const lineRect = this.resolveLineRect(lineNumber);
    if (!lineRect)
      return false;
    return clientY >= lineRect.top - MOBILE_LINE_HIT_Y_TOLERANCE_PX && clientY <= lineRect.bottom + MOBILE_LINE_HIT_Y_TOLERANCE_PX;
  }
  isWithinEmbedDragArea(embedEl, clientX, clientY) {
    if (!this.isWithinEditorTolerance(clientX))
      return false;
    const rect = embedEl.getBoundingClientRect();
    return clientX >= rect.left - MOBILE_EMBED_HIT_PADDING_PX && clientX <= rect.right + MOBILE_EMBED_HIT_PADDING_PX && clientY >= rect.top - MOBILE_EMBED_HIT_PADDING_PX && clientY <= rect.bottom + MOBILE_EMBED_HIT_PADDING_PX;
  }
  resolveEmbedElement(target, clientX, clientY) {
    if (target) {
      const fromTarget = target.closest(EMBED_BLOCK_SELECTOR);
      if (fromTarget && this.view.dom.contains(fromTarget)) {
        return fromTarget;
      }
    }
    return findEmbedElementAtPoint(this.view, clientX, clientY, {
      requireDirectWithinRoot: true,
      normalizeToEmbedRoot: false
    });
  }
  resolveLineRect(lineNumber) {
    var _a;
    if (lineNumber < 1 || lineNumber > this.view.state.doc.lines)
      return null;
    const line = this.view.state.doc.line(lineNumber);
    const startCoords = safeCoordsAtPos(this.view, line.from, 1);
    const endCoords = (_a = safeCoordsAtPos(this.view, line.to, -1)) != null ? _a : startCoords;
    if (!startCoords || !endCoords)
      return null;
    const top = Math.min(startCoords.top, endCoords.top);
    const bottom = Math.max(startCoords.bottom, endCoords.bottom);
    if (!Number.isFinite(top) || !Number.isFinite(bottom) || bottom <= top)
      return null;
    return { top, bottom };
  }
};

// src/drag/gesture/pointer-session-controller.ts
var PointerSessionController = class {
  constructor(view, handlers) {
    this.view = view;
    this.pointerListenersAttached = false;
    this.touchBlockerAttached = false;
    this.pointerCaptureTarget = null;
    this.capturedPointerId = null;
    this.onPointerMove = handlers.onPointerMove;
    this.onPointerUp = handlers.onPointerUp;
    this.onPointerCancel = handlers.onPointerCancel;
    this.onWindowBlur = handlers.onWindowBlur;
    this.onDocumentVisibilityChange = handlers.onDocumentVisibilityChange;
    this.onTouchMove = handlers.onTouchMove;
  }
  attachPointerListeners() {
    if (this.pointerListenersAttached)
      return;
    window.addEventListener("pointermove", this.onPointerMove, { passive: false, capture: true });
    window.addEventListener("pointerup", this.onPointerUp, { passive: false, capture: true });
    window.addEventListener("pointercancel", this.onPointerCancel, { passive: false, capture: true });
    window.addEventListener("blur", this.onWindowBlur);
    document.addEventListener("visibilitychange", this.onDocumentVisibilityChange);
    this.attachTouchBlocker();
    this.pointerListenersAttached = true;
  }
  detachPointerListeners() {
    if (!this.pointerListenersAttached)
      return;
    window.removeEventListener("pointermove", this.onPointerMove, true);
    window.removeEventListener("pointerup", this.onPointerUp, true);
    window.removeEventListener("pointercancel", this.onPointerCancel, true);
    window.removeEventListener("blur", this.onWindowBlur);
    document.removeEventListener("visibilitychange", this.onDocumentVisibilityChange);
    this.detachTouchBlocker();
    this.pointerListenersAttached = false;
  }
  tryCapturePointer(e) {
    this.releasePointerCapture();
    const candidates = [this.view.dom];
    const target = e.target;
    if (target instanceof Element && target !== this.view.dom) {
      candidates.push(target);
    }
    for (const candidate of candidates) {
      if (typeof candidate.setPointerCapture !== "function")
        continue;
      try {
        candidate.setPointerCapture(e.pointerId);
        this.pointerCaptureTarget = candidate;
        this.capturedPointerId = e.pointerId;
        return;
      } catch (e2) {
      }
    }
  }
  tryCapturePointerById(pointerId) {
    if (typeof this.view.dom.setPointerCapture !== "function")
      return;
    try {
      this.view.dom.setPointerCapture(pointerId);
      this.pointerCaptureTarget = this.view.dom;
      this.capturedPointerId = pointerId;
    } catch (e) {
    }
  }
  releasePointerCapture() {
    if (!this.pointerCaptureTarget || this.capturedPointerId === null)
      return;
    if (typeof this.pointerCaptureTarget.releasePointerCapture === "function") {
      try {
        this.pointerCaptureTarget.releasePointerCapture(this.capturedPointerId);
      } catch (e) {
      }
    }
    this.pointerCaptureTarget = null;
    this.capturedPointerId = null;
  }
  attachTouchBlocker() {
    if (this.touchBlockerAttached)
      return;
    document.addEventListener("touchmove", this.onTouchMove, { passive: false, capture: true });
    window.addEventListener("touchmove", this.onTouchMove, { passive: false, capture: true });
    this.touchBlockerAttached = true;
  }
  detachTouchBlocker() {
    if (!this.touchBlockerAttached)
      return;
    document.removeEventListener("touchmove", this.onTouchMove, true);
    window.removeEventListener("touchmove", this.onTouchMove, true);
    this.touchBlockerAttached = false;
  }
};

// src/domain/block/block-detector.ts
var import_state3 = require("@codemirror/state");

// src/domain/markdown/fence-scanner.ts
var fenceLazyScanCache = /* @__PURE__ */ new WeakMap();
function isSingleLineMathFence(lineText) {
  const trimmed = lineText.trimStart();
  if (!trimmed.startsWith("$$"))
    return false;
  return trimmed.slice(2).includes("$$");
}
function assignFenceRangeByLine(rangeByLine, startLine, endLine) {
  const range = { startLine, endLine };
  for (let i = startLine; i <= endLine; i++) {
    rangeByLine.set(i, range);
  }
}
function createFenceLazyScanState() {
  return {
    scannedUntilLine: 0,
    openCodeStartLine: 0,
    openMathStartLine: 0,
    fullyScanned: false,
    codeRangeByLine: /* @__PURE__ */ new Map(),
    mathRangeByLine: /* @__PURE__ */ new Map()
  };
}
function getFenceLazyScanState(doc) {
  const cached = fenceLazyScanCache.get(doc);
  if (cached)
    return cached;
  const created = createFenceLazyScanState();
  fenceLazyScanCache.set(doc, created);
  return created;
}
function scanFenceLine(state, lineNumber, text) {
  if (state.openCodeStartLine !== 0) {
    if (isCodeFenceLine(text)) {
      assignFenceRangeByLine(state.codeRangeByLine, state.openCodeStartLine, lineNumber);
      state.openCodeStartLine = 0;
    }
    return;
  }
  if (state.openMathStartLine !== 0) {
    if (isMathFenceLine(text)) {
      assignFenceRangeByLine(state.mathRangeByLine, state.openMathStartLine, lineNumber);
      state.openMathStartLine = 0;
    }
    return;
  }
  if (isCodeFenceLine(text)) {
    state.openCodeStartLine = lineNumber;
    return;
  }
  if (isMathFenceLine(text)) {
    if (isSingleLineMathFence(text)) {
      assignFenceRangeByLine(state.mathRangeByLine, lineNumber, lineNumber);
    } else {
      state.openMathStartLine = lineNumber;
    }
  }
}
function finalizeFenceStateAtDocEnd(state) {
  if (state.openCodeStartLine !== 0) {
    assignFenceRangeByLine(state.codeRangeByLine, state.openCodeStartLine, state.openCodeStartLine);
    state.openCodeStartLine = 0;
  }
  state.openMathStartLine = 0;
  state.fullyScanned = true;
}
function ensureFenceScanComplete(doc) {
  const state = getFenceLazyScanState(doc);
  if (state.fullyScanned)
    return state;
  let cursor = state.scannedUntilLine + 1;
  while (cursor <= doc.lines) {
    scanFenceLine(state, cursor, doc.line(cursor).text);
    cursor++;
  }
  state.scannedUntilLine = Math.max(state.scannedUntilLine, cursor - 1);
  finalizeFenceStateAtDocEnd(state);
  return state;
}
function prewarmFenceScan(doc) {
  ensureFenceScanComplete(doc);
}
function findMathBlockRange(doc, lineNumber) {
  var _a;
  if (lineNumber < 1 || lineNumber > doc.lines)
    return null;
  const state = ensureFenceScanComplete(doc);
  return (_a = state.mathRangeByLine.get(lineNumber)) != null ? _a : null;
}
function findCodeBlockRange(doc, lineNumber) {
  var _a;
  if (lineNumber < 1 || lineNumber > doc.lines)
    return null;
  const state = ensureFenceScanComplete(doc);
  return (_a = state.codeRangeByLine.get(lineNumber)) != null ? _a : null;
}

// src/domain/block/block-detector.ts
var LIST_UNORDERED_RE = /^[-*+]\s/;
var LIST_ORDERED_RE = /^\d+\.\s/;
var LIST_TASK_RE = /^[-*+]\s\[[ x]\]/;
var CODE_FENCE_RE = /^```/;
var MATH_FENCE_RE = /^\$\$/;
var BLOCKQUOTE_RE = /^>/;
var TABLE_RE = /^\|/;
function getHeadingLevel(lineText) {
  const trimmed = lineText.trimStart();
  const match = trimmed.match(/^(#{1,6})\s+/);
  if (!match)
    return null;
  return match[1].length;
}
function getHeadingSectionRange(doc, lineNumber) {
  if (lineNumber < 1 || lineNumber > doc.lines)
    return null;
  const currentHeadingLevel = getHeadingLevel(doc.line(lineNumber).text);
  if (!currentHeadingLevel)
    return null;
  let endLine = lineNumber;
  for (let i = lineNumber + 1; i <= doc.lines; i++) {
    const nextHeadingLevel = getHeadingLevel(doc.line(i).text);
    if (nextHeadingLevel !== null && nextHeadingLevel <= currentHeadingLevel) {
      break;
    }
    endLine = i;
  }
  return { startLine: lineNumber, endLine };
}
function detectBlockType(lineText) {
  const trimmed = lineText.trimStart();
  if (getHeadingLevel(lineText) !== null) {
    return "heading" /* Heading */;
  }
  if (isHorizontalRuleLine(trimmed)) {
    return "hr" /* HorizontalRule */;
  }
  if (LIST_UNORDERED_RE.test(trimmed) || LIST_ORDERED_RE.test(trimmed) || LIST_TASK_RE.test(trimmed)) {
    return "list-item" /* ListItem */;
  }
  if (CODE_FENCE_RE.test(trimmed)) {
    return "code-block" /* CodeBlock */;
  }
  if (MATH_FENCE_RE.test(trimmed)) {
    return "math-block" /* MathBlock */;
  }
  if (BLOCKQUOTE_RE.test(trimmed)) {
    return "blockquote" /* Blockquote */;
  }
  if (TABLE_RE.test(trimmed)) {
    return "table" /* Table */;
  }
  if (trimmed.length === 0) {
    return "unknown" /* Unknown */;
  }
  return "paragraph" /* Paragraph */;
}
function getIndentLevel(lineText, tabSize = 2) {
  const match = lineText.match(/^(\s*)/);
  if (!match)
    return 0;
  const spaces = match[1];
  const width = getIndentWidthWithTabSize(spaces, tabSize);
  const unit = tabSize > 0 ? tabSize : 2;
  return Math.floor(width / unit);
}
function getIndentWidthWithTabSize(indentRaw, tabSize) {
  const unit = tabSize > 0 ? tabSize : 2;
  let width = 0;
  for (const ch of indentRaw) {
    width += ch === "	" ? unit : 1;
  }
  return width;
}
function getIndentWidth(lineText, tabSize) {
  const match = lineText.match(/^(\s*)/);
  if (!match)
    return 0;
  return getIndentWidthWithTabSize(match[1], tabSize);
}
function parseListMarker(lineText, tabSize) {
  const match = lineText.match(/^(\s*)([-*+])\s\[[ xX]\]\s+/);
  if (match) {
    return { isListItem: true, indentWidth: getIndentWidthWithTabSize(match[1], tabSize) };
  }
  const unorderedMatch = lineText.match(/^(\s*)([-*+])\s+/);
  if (unorderedMatch) {
    return { isListItem: true, indentWidth: getIndentWidthWithTabSize(unorderedMatch[1], tabSize) };
  }
  const orderedMatch = lineText.match(/^(\s*)(\d+)[.)]\s+/);
  if (orderedMatch) {
    return { isListItem: true, indentWidth: getIndentWidthWithTabSize(orderedMatch[1], tabSize) };
  }
  return { isListItem: false, indentWidth: getIndentWidth(lineText, tabSize) };
}
function isCalloutHeader(restText) {
  return restText.trimStart().startsWith("[!");
}
function isInsideCalloutContainer(doc, lineNumber, depth) {
  for (let i = lineNumber; i >= 1; i--) {
    const text = doc.line(i).text;
    const lineDepth = getBlockquoteDepthFromLine(text);
    if (lineDepth === 0 || lineDepth < depth)
      break;
    const info = splitBlockquotePrefix(text);
    if (isCalloutHeader(info.rest))
      return true;
  }
  return false;
}
function getBlockquoteContainerRange(doc, lineNumber, depth) {
  let startLine = lineNumber;
  for (let i = lineNumber - 1; i >= 1; i--) {
    const d = getBlockquoteDepthFromLine(doc.line(i).text);
    if (d === 0 || d < depth)
      break;
    startLine = i;
  }
  let endLine = lineNumber;
  for (let i = lineNumber + 1; i <= doc.lines; i++) {
    const d = getBlockquoteDepthFromLine(doc.line(i).text);
    if (d === 0 || d < depth)
      break;
    endLine = i;
  }
  return { startLine, endLine };
}
function getListItemSubtreeRange(doc, lineNumber, tabSize) {
  const lineText = doc.line(lineNumber).text;
  const currentInfo = parseListMarker(lineText, tabSize);
  const currentIndent = currentInfo.indentWidth;
  let endLine = lineNumber;
  for (let i = lineNumber + 1; i <= doc.lines; i++) {
    const nextLine = doc.line(i);
    const nextText = nextLine.text;
    if (nextText.trim().length === 0) {
      const lookahead = findNextNonEmptyLine(doc, i + 1, tabSize);
      if (!lookahead || lookahead.isListItem && lookahead.indentWidth <= currentIndent || lookahead.indentWidth <= currentIndent) {
        break;
      }
      endLine = i;
      continue;
    }
    const nextInfo = parseListMarker(nextText, tabSize);
    if (nextInfo.isListItem && nextInfo.indentWidth <= currentIndent) {
      break;
    }
    const nextIndent = getIndentWidth(nextText, tabSize);
    if (nextInfo.isListItem || nextIndent > currentIndent) {
      endLine = i;
      continue;
    }
    break;
  }
  return { startLine: lineNumber, endLine };
}
function findNextNonEmptyLine(doc, fromLine, tabSize) {
  for (let i = fromLine; i <= doc.lines; i++) {
    const text = doc.line(i).text;
    if (text.trim().length === 0)
      continue;
    const info = parseListMarker(text, tabSize);
    return { isListItem: info.isListItem, indentWidth: info.indentWidth };
  }
  return null;
}
var blockDetectionCache = /* @__PURE__ */ new WeakMap();
var LIST_LINE_MAP_COLD_BUILD_MAX_LINES = 3e4;
var YAML_FENCE_RE = /^-{3}\s*$/;
var yamlFrontmatterEndLineCache = /* @__PURE__ */ new WeakMap();
function getYamlFrontmatterEndLine(doc) {
  const cached = yamlFrontmatterEndLineCache.get(doc);
  if (cached !== void 0)
    return cached;
  let endLine = 0;
  if (doc.lines >= 2 && YAML_FENCE_RE.test(doc.line(1).text)) {
    for (let i = 2; i <= doc.lines; i++) {
      if (YAML_FENCE_RE.test(doc.line(i).text)) {
        endLine = i;
        break;
      }
    }
  }
  yamlFrontmatterEndLineCache.set(doc, endLine);
  return endLine;
}
function isInsideYamlFrontmatter(doc, lineNumber) {
  const endLine = getYamlFrontmatterEndLine(doc);
  return endLine > 0 && lineNumber >= 1 && lineNumber <= endLine;
}
var detectBlockPerfRecorder = null;
function recordDetectBlockPerf(key, durationMs) {
  if (!detectBlockPerfRecorder)
    return;
  if (!isFinite(durationMs) || durationMs < 0)
    return;
  detectBlockPerfRecorder(key, durationMs);
}
function setDetectBlockPerfRecorder(recorder) {
  detectBlockPerfRecorder = recorder;
}
function detectBlockUncached(state, lineNumber, tabSize) {
  const doc = state.doc;
  if (lineNumber < 1 || lineNumber > doc.lines) {
    return null;
  }
  if (isInsideYamlFrontmatter(doc, lineNumber)) {
    return null;
  }
  const line = doc.line(lineNumber);
  const lineText = line.text;
  let blockType = detectBlockType(lineText);
  const codeRange = findCodeBlockRange(doc, lineNumber);
  const mathRange = findMathBlockRange(doc, lineNumber);
  if (codeRange) {
    blockType = "code-block" /* CodeBlock */;
  }
  if (mathRange) {
    blockType = "math-block" /* MathBlock */;
  }
  if (blockType === "unknown" /* Unknown */) {
    return null;
  }
  let startLine = lineNumber;
  let endLine = lineNumber;
  if (blockType === "code-block" /* CodeBlock */ && codeRange) {
    startLine = codeRange.startLine;
    endLine = codeRange.endLine;
  }
  if (blockType === "math-block" /* MathBlock */ && mathRange) {
    startLine = mathRange.startLine;
    endLine = mathRange.endLine;
  }
  if (blockType === "list-item" /* ListItem */) {
    let lineMap = peekCachedLineMap(state, { tabSize });
    if (!lineMap && doc.lines <= LIST_LINE_MAP_COLD_BUILD_MAX_LINES) {
      lineMap = getLineMap(state, { tabSize });
    }
    const lineMeta = lineMap ? getLineMetaAt(lineMap, lineNumber) : null;
    const subtreeEndLine = (lineMeta == null ? void 0 : lineMeta.isList) && lineMap ? lineMap.listSubtreeEndLine[lineNumber] : 0;
    if (subtreeEndLine >= lineNumber) {
      endLine = subtreeEndLine;
    } else {
      const range = getListItemSubtreeRange(doc, lineNumber, tabSize);
      endLine = range.endLine;
    }
  }
  if (blockType === "blockquote" /* Blockquote */) {
    const quoteDepth = getBlockquoteDepthFromLine(lineText);
    const inCallout = isInsideCalloutContainer(doc, lineNumber, quoteDepth);
    if (inCallout) {
      const range = getBlockquoteContainerRange(doc, lineNumber, quoteDepth);
      startLine = range.startLine;
      endLine = range.endLine;
      blockType = "callout" /* Callout */;
    } else {
      startLine = lineNumber;
      endLine = lineNumber;
      blockType = "blockquote" /* Blockquote */;
    }
  }
  if (blockType === "table" /* Table */) {
    for (let i = lineNumber - 1; i >= 1; i--) {
      const prevLine = doc.line(i);
      if (isTableLine(prevLine.text)) {
        startLine = i;
      } else {
        break;
      }
    }
  }
  if (blockType === "table" /* Table */) {
    for (let i = lineNumber + 1; i <= doc.lines; i++) {
      const nextLine = doc.line(i);
      if (isTableLine(nextLine.text)) {
        endLine = i;
      } else {
        break;
      }
    }
  }
  const startLineObj = doc.line(startLine);
  const endLineObj = doc.line(endLine);
  const startLineText = startLineObj.text;
  let content = "";
  for (let i = startLine; i <= endLine; i++) {
    content += doc.line(i).text;
    if (i < endLine)
      content += "\n";
  }
  return {
    type: blockType,
    startLine: startLine - 1,
    // 转为0-indexed
    endLine: endLine - 1,
    from: startLineObj.from,
    to: endLineObj.to,
    indentLevel: getIndentLevel(startLineText, tabSize),
    content
  };
}
function safeTabSize(state) {
  if (state && typeof state === "object" && "facet" in state && typeof state.facet === "function") {
    try {
      return state.facet(import_state3.EditorState.tabSize) || 2;
    } catch (e) {
    }
  }
  return 2;
}
function detectBlock(state, lineNumber) {
  var _a;
  const doc = state.doc;
  const tabSize = safeTabSize(state);
  let cacheByTabSize = blockDetectionCache.get(doc);
  if (!cacheByTabSize) {
    cacheByTabSize = /* @__PURE__ */ new Map();
    blockDetectionCache.set(doc, cacheByTabSize);
  }
  let perDocCache = cacheByTabSize.get(tabSize);
  if (!perDocCache) {
    perDocCache = /* @__PURE__ */ new Map();
    cacheByTabSize.set(tabSize, perDocCache);
  }
  if (perDocCache.has(lineNumber)) {
    return (_a = perDocCache.get(lineNumber)) != null ? _a : null;
  }
  const startedAt = nowMs();
  const detected = detectBlockUncached(state, lineNumber, tabSize);
  recordDetectBlockPerf("detect_block_uncached", nowMs() - startedAt);
  perDocCache.set(lineNumber, detected);
  return detected;
}

// src/drag/gesture/range-selection/selection-model.ts
function cloneBlockInfo(block) {
  return {
    ...block,
    compositeSelection: block.compositeSelection ? {
      ranges: block.compositeSelection.ranges.map((range) => ({ ...range }))
    } : void 0
  };
}
function buildSelectedBlockRangeFromBlockInfo(block) {
  return {
    startLineNumber: block.startLine + 1,
    endLineNumber: block.endLine + 1
  };
}
function buildBlockInfoFromRange(doc, startLineNumber, endLineNumber, template) {
  const safeStart = clampLineNumber(doc.lines, startLineNumber);
  const safeEnd = Math.max(safeStart, clampLineNumber(doc.lines, endLineNumber));
  const startLine = doc.line(safeStart);
  const endLine = doc.line(safeEnd);
  return {
    type: template.type,
    startLine: safeStart - 1,
    endLine: safeEnd - 1,
    from: startLine.from,
    to: endLine.to,
    indentLevel: template.indentLevel,
    content: doc.sliceString(startLine.from, endLine.to)
  };
}
function buildDragSourceBlockFromBlocks(doc, blocks, template) {
  const normalizedBlocks = mergeSelectedBlocks(doc.lines, blocks);
  if (normalizedBlocks.length === 0) {
    return buildBlockInfoFromRange(doc, template.startLine + 1, template.endLine + 1, template);
  }
  const segments = groupSelectedBlocksIntoSegments(doc.lines, normalizedBlocks);
  if (segments.length === 1) {
    const [segment] = segments;
    return buildBlockInfoFromRange(doc, segment.startLineNumber, segment.endLineNumber, template);
  }
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];
  const firstLine = doc.line(firstSegment.startLineNumber);
  const lastLine = doc.line(lastSegment.endLineNumber);
  const content = segments.map((segment) => {
    const startLine = doc.line(segment.startLineNumber);
    const endLine = doc.line(segment.endLineNumber);
    const from = startLine.from;
    const to = endLine.to;
    return doc.sliceString(from, to);
  }).join("\n");
  return {
    type: template.type,
    startLine: firstSegment.startLineNumber - 1,
    endLine: lastSegment.endLineNumber - 1,
    from: firstLine.from,
    to: lastLine.to,
    indentLevel: template.indentLevel,
    content,
    compositeSelection: {
      ranges: segments.map((segment) => ({
        startLine: segment.startLineNumber - 1,
        endLine: segment.endLineNumber - 1
      }))
    }
  };
}
function resolveBlockBoundaryAtLine(state, lineNumber) {
  const doc = state.doc;
  const clampedLine = Math.max(1, Math.min(doc.lines, lineNumber));
  const block = detectBlock(state, clampedLine);
  if (!block) {
    return {
      startLineNumber: clampedLine,
      endLineNumber: clampedLine
    };
  }
  return {
    startLineNumber: Math.max(1, block.startLine + 1),
    endLineNumber: Math.min(doc.lines, block.endLine + 1)
  };
}
function buildRangeSelectionBoundaryFromBlock(doc, block) {
  const startLineNumber = clampLineNumber(doc.lines, block.startLine + 1);
  const endLineNumber = clampLineNumber(doc.lines, block.endLine + 1);
  const representativeLineNumber = Math.max(
    startLineNumber,
    Math.min(endLineNumber, doc.lineAt(block.from).number)
  );
  return {
    startLineNumber,
    endLineNumber,
    representativeLineNumber
  };
}
function collectSelectedBlocksBetween(state, anchorStartLineNumber, anchorEndLineNumber, targetBlockStartLineNumber, targetBlockEndLineNumber) {
  const docLines = state.doc.lines;
  const startLineNumber = Math.max(
    1,
    Math.min(docLines, Math.min(anchorStartLineNumber, targetBlockStartLineNumber))
  );
  const endLineNumber = Math.max(
    1,
    Math.min(docLines, Math.max(anchorEndLineNumber, targetBlockEndLineNumber))
  );
  const blocks = [];
  let cursor = startLineNumber;
  while (cursor <= endLineNumber) {
    const boundary = resolveBlockBoundaryAtLine(state, cursor);
    blocks.push({
      startLineNumber: boundary.startLineNumber,
      endLineNumber: boundary.endLineNumber
    });
    cursor = Math.max(cursor + 1, boundary.endLineNumber + 1);
  }
  return mergeSelectedBlocks(docLines, blocks);
}

// src/drag/gesture/range-selection/hit-boundary.ts
function safeGetBlockInfoAtPoint(getBlockInfoAtPoint, clientX, clientY) {
  try {
    return getBlockInfoAtPoint(clientX, clientY);
  } catch (e) {
    return null;
  }
}
function resolveRangeBoundaryAtPoint(view, clientX, clientY, getBlockInfoAtPoint) {
  const doc = view.state.doc;
  if (doc.lines <= 0)
    return null;
  const block = safeGetBlockInfoAtPoint(getBlockInfoAtPoint, clientX, clientY);
  if (!block)
    return null;
  return buildRangeSelectionBoundaryFromBlock(doc, block);
}

// src/drag/gesture/range-selection/selection-grip-hit.ts
var RANGE_SELECTION_GRIP_HIT_PADDING_PX = 20;
var RANGE_SELECTION_GRIP_HIT_X_PADDING_PX = 28;
function getCommittedSelectionAnchorMaxX(committedSelection, resolveAnchorSpan2) {
  let maxX = null;
  const segments = groupSelectedBlocksIntoSegments(
    committedSelection.selectedBlock.endLine + 1,
    committedSelection.blocks
  );
  for (const segment of segments) {
    const anchorSpan = resolveAnchorSpan2(segment);
    if (!anchorSpan)
      continue;
    maxX = maxX === null ? anchorSpan.x : Math.max(maxX, anchorSpan.x);
  }
  return maxX;
}
function shouldClearCommittedSelectionOnPointerDown(options) {
  const committedSelection = options.committedSelection;
  if (!committedSelection)
    return false;
  if (options.target.closest(`.${RANGE_SELECTED_HANDLE_CLASS}`))
    return false;
  if (options.target.closest(`.${DRAG_HANDLE_CLASS}`))
    return false;
  if (options.pointerType && options.pointerType !== "mouse") {
    if (!options.isWithinContentTolerance(options.clientX)) {
      return true;
    }
    const inContent = options.contentDOM.contains(options.target) || !!options.target.closest(CODEMIRROR_CONTENT_SELECTOR);
    const inGutter = !!options.target.closest(CODEMIRROR_GUTTERS_SELECTOR);
    return !inContent && !inGutter;
  }
  const anchorMaxX = getCommittedSelectionAnchorMaxX(committedSelection, options.resolveAnchorSpan);
  if (anchorMaxX === null)
    return false;
  return options.clientX > anchorMaxX + RANGE_SELECTION_GRIP_HIT_X_PADDING_PX;
}
function isCommittedSelectionGripHit(options) {
  const committedSelection = options.committedSelection;
  if (!committedSelection)
    return false;
  const hitHandle = options.target.closest(`.${RANGE_SELECTED_HANDLE_CLASS}`);
  if (hitHandle)
    return true;
  if (options.pointerType && options.pointerType !== "mouse") {
    if (!options.isWithinMobileDragHotzoneBand(options.clientX)) {
      return false;
    }
  }
  const segments = groupSelectedBlocksIntoSegments(
    committedSelection.selectedBlock.endLine + 1,
    committedSelection.blocks
  );
  for (const segment of segments) {
    const anchorSpan = options.resolveAnchorSpan(segment);
    if (!anchorSpan)
      continue;
    if (!options.pointerType || options.pointerType === "mouse") {
      if (Math.abs(options.clientX - anchorSpan.x) > RANGE_SELECTION_GRIP_HIT_X_PADDING_PX) {
        continue;
      }
    }
    const top = anchorSpan.topY - RANGE_SELECTION_GRIP_HIT_PADDING_PX;
    const bottom = anchorSpan.bottomY + RANGE_SELECTION_GRIP_HIT_PADDING_PX;
    if (options.clientY >= top && options.clientY <= bottom) {
      return true;
    }
  }
  return false;
}

// src/drag/gesture/range-selection/selection-session-flow.ts
function resolveRangeSelectConfig(pointerType, mouseLongPressMs, getTouchRangeSelectLongPressMs) {
  if (pointerType === "mouse") {
    return {
      longPressMs: mouseLongPressMs
    };
  }
  return {
    longPressMs: getTouchRangeSelectLongPressMs()
  };
}
function createInitialRangeSelectionState(options) {
  var _a;
  const anchorStartLineNumber = options.blockInfo.startLine + 1;
  const anchorEndLineNumber = options.blockInfo.endLine + 1;
  if (anchorStartLineNumber < 1 || anchorEndLineNumber > options.doc.lines || anchorStartLineNumber > anchorEndLineNumber) {
    return null;
  }
  const anchorBlock = buildSelectedBlockRangeFromBlockInfo(options.blockInfo);
  const operation = (_a = options.initialOperation) != null ? _a : isSelectedBlockCoveredByBlocks(
    options.doc.lines,
    anchorBlock,
    options.committedBlocksSnapshot
  ) ? "remove" : "add";
  const selectionBlocks = operation === "remove" ? subtractSelectedBlocks(options.doc.lines, options.committedBlocksSnapshot, [anchorBlock]) : mergeSelectedBlocks(options.doc.lines, [...options.committedBlocksSnapshot, anchorBlock]);
  const anchorSelectionBlock = buildDragSourceBlockFromBlocks(options.doc, selectionBlocks, options.blockInfo);
  return {
    anchorSelectionBlock,
    directDragSourceBlock: cloneBlockInfo(options.blockInfo),
    activeSelectionBlock: anchorSelectionBlock,
    operation,
    preferLongPressDrag: false,
    selectionGestureStarted: false,
    pointerId: options.pointerId,
    startX: options.startX,
    startY: options.startY,
    latestX: options.startX,
    latestY: options.startY,
    pointerType: options.pointerType,
    dragReady: options.pointerType === "mouse",
    longPressReady: false,
    isIntercepting: options.pointerType !== "mouse",
    timeoutId: null,
    dragTimeoutId: null,
    anchorStartLineNumber,
    anchorEndLineNumber,
    currentLineNumber: anchorEndLineNumber,
    committedBlocksSnapshot: options.committedBlocksSnapshot,
    selectionBlocks
  };
}
function autoScrollRangeSelection(scroller, clientY) {
  const rect = scroller.getBoundingClientRect();
  const topEdgeZone = 88;
  const bottomEdgeZone = 88;
  let delta = 0;
  if (clientY < rect.top + topEdgeZone) {
    delta = -Math.min(22, (rect.top + topEdgeZone - clientY) * 0.35 + 2);
  } else if (clientY > rect.bottom - bottomEdgeZone) {
    delta = Math.min(22, (clientY - (rect.bottom - bottomEdgeZone)) * 0.35 + 2);
  }
  if (delta === 0)
    return false;
  const previousScrollTop = scroller.scrollTop;
  scroller.scrollTop += delta;
  return scroller.scrollTop !== previousScrollTop;
}

// src/drag/gesture/range-selection/selection-state.ts
function computeUpdatedSelectionState(editorState, state, target) {
  const activeBlocks = collectSelectedBlocksBetween(
    editorState,
    state.anchorStartLineNumber,
    state.anchorEndLineNumber,
    target.startLineNumber,
    target.endLineNumber
  );
  const docLines = editorState.doc.lines;
  const selectionBlocks = state.operation === "remove" ? subtractSelectedBlocks(docLines, state.committedBlocksSnapshot, activeBlocks) : mergeSelectedBlocks(docLines, [
    ...state.committedBlocksSnapshot,
    ...activeBlocks
  ]);
  const activeSelectionBlock = buildDragSourceBlockFromBlocks(
    editorState.doc,
    selectionBlocks,
    state.anchorSelectionBlock
  );
  return {
    currentLineNumber: target.representativeLineNumber,
    selectionBlocks,
    activeSelectionBlock
  };
}
function buildCommittedRangeSelection(doc, selectionBlocks, templateBlock) {
  const committedBlocks = mergeSelectedBlocks(doc.lines, selectionBlocks);
  if (committedBlocks.length === 0) {
    return null;
  }
  const selectedBlock = buildDragSourceBlockFromBlocks(doc, committedBlocks, templateBlock);
  return {
    selectedBlock,
    blocks: committedBlocks
  };
}
function buildCommittedRangeDeletionChanges(doc, blocks) {
  return groupSelectedBlocksIntoSegments(doc.lines, blocks).map((segment) => {
    const startLineNumber = Math.max(1, Math.min(doc.lines, segment.startLineNumber));
    const endLineNumber = Math.max(startLineNumber, Math.min(doc.lines, segment.endLineNumber));
    const from = doc.line(startLineNumber).from;
    const endLine = doc.line(endLineNumber);
    const to = endLineNumber === doc.lines ? doc.length : Math.min(doc.length, endLine.to + 1);
    return { from, to };
  }).filter((change) => change.to > change.from);
}

// src/drag/gesture/range-selection/selection-flow.ts
function autoScrollSelectionRange(view, clientY) {
  var _a, _b;
  const scroller = (_b = (_a = view.scrollDOM) != null ? _a : view.dom.querySelector(".cm-scroller")) != null ? _b : null;
  if (!scroller)
    return false;
  return autoScrollRangeSelection(scroller, clientY);
}
function updateSelectionFromBoundary(view, state, target, rangeVisual) {
  const next = computeUpdatedSelectionState(view.state, state, target);
  state.currentLineNumber = next.currentLineNumber;
  state.selectionBlocks = next.selectionBlocks;
  state.activeSelectionBlock = next.activeSelectionBlock;
  rangeVisual.render(state.selectionBlocks);
}
function updateSelectionFromLine(view, state, lineNumber, rangeVisual) {
  const doc = view.state.doc;
  const clampedLine = Math.max(1, Math.min(doc.lines, lineNumber));
  const boundary = resolveBlockBoundaryAtLine(view.state, clampedLine);
  updateSelectionFromBoundary(
    view,
    state,
    {
      ...boundary,
      representativeLineNumber: clampedLine
    },
    rangeVisual
  );
}
function commitSelectionRange(view, state, rangeVisual) {
  const committed = buildCommittedRangeSelection(
    view.state.doc,
    state.selectionBlocks,
    state.anchorSelectionBlock
  );
  if (!committed) {
    rangeVisual.clear();
    return null;
  }
  rangeVisual.render(committed.blocks);
  return committed;
}
function clearCommittedSelectionRange(committed, rangeVisual) {
  if (!committed)
    return committed;
  rangeVisual.clear();
  return null;
}
function deleteCommittedSelectionRange(view, committed, rangeVisual) {
  if (!committed)
    return committed;
  const doc = view.state.doc;
  const changes = buildCommittedRangeDeletionChanges(doc, committed.blocks);
  if (changes.length > 0) {
    anchorSelectionBeforeUndoableChange(view, committed.selectedBlock.from);
    view.dispatch({ changes });
  }
  rangeVisual.clear();
  return null;
}
function cloneCommittedSelectionBlock(committed) {
  if (!committed)
    return null;
  return cloneBlockInfo(committed.selectedBlock);
}
function refreshSelectionVisual(gesture, committed, rangeVisual) {
  if (gesture.phase === "range_selecting") {
    rangeVisual.render(gesture.rangeSelect.selectionBlocks);
    return;
  }
  if (gesture.phase === "mobile_selecting") {
    rangeVisual.render(gesture.mobileSelect.selectedBlocks, { highlightLines: true, showMobileResizeHandles: true });
    return;
  }
  if (committed) {
    rangeVisual.render(committed.blocks);
  }
}

// src/drag/gesture/drag-lifecycle-flow.ts
function buildPressPendingLifecycleEvent(sourceBlock, pointerType, pressReady) {
  return {
    type: "drag_press_pending",
    phase: "press_pending",
    sourceBlock,
    targetLine: null,
    listIntent: null,
    rejectReason: null,
    pointerType,
    pressReady
  };
}
function buildDragStartedLifecycleEvent(sourceBlock, pointerType) {
  return {
    type: "drag_started",
    phase: "drag_active",
    sourceBlock,
    targetLine: null,
    listIntent: null,
    rejectReason: null,
    pointerType
  };
}
function buildDragTargetChangedLifecycleEvent(params) {
  return {
    type: "drag_target_changed",
    phase: "drag_active",
    sourceBlock: params.sourceBlock,
    targetLine: params.targetLine,
    listIntent: params.listIntent,
    rejectReason: params.rejectReason,
    pointerType: params.pointerType
  };
}
function buildDropCommitLifecycleEvent(params) {
  return {
    type: "drag_drop_commit",
    phase: "drop_commit",
    sourceBlock: params.sourceBlock,
    targetLine: params.targetLine,
    listIntent: params.listIntent,
    rejectReason: null,
    pointerType: params.pointerType
  };
}
function buildCancelledLifecycleEvent(params) {
  var _a, _b;
  return {
    type: "drag_cancelled",
    phase: "cancelled",
    sourceBlock: params.sourceBlock,
    targetLine: (_a = params.targetLine) != null ? _a : null,
    listIntent: (_b = params.listIntent) != null ? _b : null,
    rejectReason: params.rejectReason,
    pointerType: params.pointerType
  };
}
function buildIdleLifecycleEvent() {
  return {
    type: "drag_idle",
    phase: "idle",
    sourceBlock: null,
    targetLine: null,
    listIntent: null,
    rejectReason: null,
    pointerType: null
  };
}

// src/drag/gesture/drag-pointer-flow.ts
function isMobileEnvironment() {
  const body = document.body;
  if ((body == null ? void 0 : body.classList.contains("is-mobile")) || (body == null ? void 0 : body.classList.contains("is-phone")) || (body == null ? void 0 : body.classList.contains("is-tablet"))) {
    return true;
  }
  if (typeof window === "undefined" || typeof window.matchMedia !== "function")
    return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}
function shouldStartMobilePressDrag(e) {
  return e.pointerType === "touch" && e.button === 0;
}

// src/drag/gesture/drag-controller.ts
var MOBILE_DRAG_LONG_PRESS_MS = 200;
var MOBILE_DRAG_START_MOVE_THRESHOLD_PX = 8;
var MOBILE_DRAG_CANCEL_MOVE_THRESHOLD_PX = 12;
var TOUCH_RANGE_SELECT_LONG_PRESS_MS = 900;
var MIN_TOUCH_RANGE_SELECT_LONG_PRESS_MS = 300;
var MAX_TOUCH_RANGE_SELECT_LONG_PRESS_MS = 2e3;
var MOUSE_RANGE_SELECT_LONG_PRESS_MS = 260;
var MOUSE_SECONDARY_DRAG_START_MOVE_THRESHOLD_PX = 4;
var DragEventHandler = class {
  constructor(view, deps) {
    this.view = view;
    this.deps = deps;
    this.gesture = { phase: "idle" };
    this.committedRangeSelection = null;
    this.onEditorPointerDown = (e) => {
      const target = e.target instanceof HTMLElement ? e.target : null;
      if (!target)
        return;
      const pointerType = e.pointerType || null;
      const multiLineSelectionEnabled = this.isMultiLineSelectionEnabled();
      if (!multiLineSelectionEnabled) {
        this.clearCommittedRangeSelection();
      }
      const canHandleCommittedSelection = multiLineSelectionEnabled && e.button === 0 && !!this.committedRangeSelection;
      if (canHandleCommittedSelection && this.shouldClearCommittedSelectionOnPointerDown(target, e.clientX, pointerType)) {
        this.clearCommittedRangeSelection();
      }
      const resizeHandle = target.closest(`.${MOBILE_SELECTION_RESIZE_HANDLE_CLASS}`);
      if (resizeHandle && this.beginMobileSelectionResize(resizeHandle, e)) {
        return;
      }
      const handle = target.closest(`.${DRAG_HANDLE_CLASS}`);
      if (handle && !handle.classList.contains(EMBED_HANDLE_CLASS)) {
        if (this.beginMobileSelectionDrag(handle, e)) {
          return;
        }
        if (this.retargetActiveMobileRangeSelectionFromHandle(handle, e)) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        this.startPointerDragFromHandle(handle, e);
        return;
      }
      if (this.gesture.phase === "mobile_selecting" && pointerType !== "mouse") {
        if (this.handleMobileSelectionTextPointerDown(e)) {
          return;
        }
        return;
      }
      if (canHandleCommittedSelection && this.isSelectionDragGripHit(target, e.clientX, e.clientY, pointerType)) {
        const committedBlock = this.getCommittedSelectionBlock();
        if (committedBlock) {
          if (this.gesture.phase === "range_selecting") {
            this.retargetMobileRangeSelection(e);
          } else {
            this.beginPressPendingDrag(committedBlock, e);
          }
          return;
        }
      }
      if (!this.shouldStartMobilePressDrag(e))
        return;
      if (this.shouldDismissMobileEditorInputStateForPointerDown(target)) {
        this.dismissMobileEditorInputState();
      }
      const inTextLineOrEmbedArea = this.isMobileTextLongPressDragEnabled() && this.mobile.isWithinMobileTextLineOrEmbedArea(target, e.clientX, e.clientY);
      if (!inTextLineOrEmbedArea)
        return;
      const blockInfo = this.deps.getBlockInfoAtPoint(e.clientX, e.clientY);
      if (!blockInfo)
        return;
      if (this.deps.isBlockInsideRenderedTableCell(blockInfo))
        return;
      this.beginPressPendingDrag(blockInfo, e, { deferInterception: true });
    };
    this.onLostPointerCapture = (e) => this.handleLostPointerCapture(e);
    this.onWindowKeyDown = (e) => this.handleWindowKeyDown(e);
    this.onDocumentFocusIn = (e) => this.handleDocumentFocusIn(e);
    this.onEnterMobileSelectionMode = (e) => this.handleEnterMobileSelectionMode(e);
    this.handleSelectionOverlayAction = (action) => {
      var _a, _b;
      if (action === "delete") {
        this.deleteCommittedRangeSelection();
        return;
      }
      if (action === "convert") {
        const block = this.getCommittedSelectionBlock();
        if (block) {
          (_b = (_a = this.deps).openBlockTypeMenu) == null ? void 0 : _b.call(_a, block, null);
        }
        return;
      }
      this.clearCommittedRangeSelection();
    };
    this.rangeVisual = new RangeSelectionVisualManager(
      this.view,
      () => this.refreshRangeSelectionVisual(),
      (blockStart) => {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.deps).getVisibleHandleForBlockStart) == null ? void 0 : _b.call(_a, blockStart)) != null ? _c : null;
      },
      this.handleSelectionOverlayAction
    );
    this.mobile = new MobileGestureController(this.view, (e) => this.handleDocumentFocusIn(e));
    this.pointer = new PointerSessionController(this.view, {
      onPointerMove: (e) => this.handlePointerMove(e),
      onPointerUp: (e) => this.handlePointerUp(e),
      onPointerCancel: (e) => this.handlePointerCancel(e),
      onWindowBlur: () => this.handleWindowBlur(),
      onDocumentVisibilityChange: () => this.handleDocumentVisibilityChange(),
      onTouchMove: (e) => this.handleTouchMove(e)
    });
  }
  attach() {
    const editorDom = this.view.dom;
    editorDom.addEventListener("pointerdown", this.onEditorPointerDown, true);
    editorDom.addEventListener("lostpointercapture", this.onLostPointerCapture, true);
    window.addEventListener("keydown", this.onWindowKeyDown, true);
    editorDom.addEventListener("focusin", this.onDocumentFocusIn, true);
    editorDom.addEventListener("dnd:enter-mobile-selection-mode", this.onEnterMobileSelectionMode);
  }
  startPointerDragFromHandle(handle, e, getBlockInfo) {
    var _a, _b;
    if (this.gesture.phase !== "idle")
      return;
    const blockInfo = (_b = (_a = getBlockInfo ? getBlockInfo() : null) != null ? _a : this.deps.getBlockInfoForHandle(handle)) != null ? _b : this.deps.getBlockInfoAtPoint(e.clientX, e.clientY);
    if (!blockInfo)
      return;
    if (this.deps.isBlockInsideRenderedTableCell(blockInfo))
      return;
    const multiLineSelectionEnabled = this.isMultiLineSelectionEnabled();
    if (e.pointerType === "mouse") {
      if (e.button !== 0)
        return;
      if (multiLineSelectionEnabled) {
        if (this.committedRangeSelection) {
          this.beginRangeSelectionSession(blockInfo, e, handle, { skipLongPress: true });
          return;
        }
        if (this.isShiftRangeSelectionPointerDown(e)) {
          this.beginRangeSelectionSession(blockInfo, e, handle, { skipLongPress: true });
          return;
        }
        this.beginRangeSelectionSession(blockInfo, e, handle);
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      this.pointer.tryCapturePointer(e);
      this.enterDraggingState(blockInfo, e.pointerId, e.clientX, e.clientY, e.pointerType || null);
      return;
    }
    if (this.isMobileEnvironment()) {
      if (multiLineSelectionEnabled && this.committedRangeSelection) {
        this.beginRangeSelectionSession(blockInfo, e, handle, { skipLongPress: true });
        return;
      }
      this.beginPressPendingDrag(blockInfo, e);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.pointer.tryCapturePointer(e);
    this.enterDraggingState(blockInfo, e.pointerId, e.clientX, e.clientY, e.pointerType || null);
  }
  destroy() {
    this.resetInteractionSession({ shouldFinishDragSession: true, shouldHideDropIndicator: true });
    this.clearCommittedRangeSelection();
    this.rangeVisual.destroy();
    const editorDom = this.view.dom;
    editorDom.removeEventListener("pointerdown", this.onEditorPointerDown, true);
    editorDom.removeEventListener("lostpointercapture", this.onLostPointerCapture, true);
    window.removeEventListener("keydown", this.onWindowKeyDown, true);
    editorDom.removeEventListener("focusin", this.onDocumentFocusIn, true);
    editorDom.removeEventListener("dnd:enter-mobile-selection-mode", this.onEnterMobileSelectionMode);
  }
  isGestureActive() {
    return this.hasActivePointerSession();
  }
  refreshSelectionVisual() {
    if (!this.isMultiLineSelectionEnabled()) {
      this.clearCommittedRangeSelection();
      return;
    }
    this.rangeVisual.scheduleRefresh();
  }
  isMobileEnvironment() {
    return isMobileEnvironment();
  }
  shouldStartMobilePressDrag(e) {
    if (this.gesture.phase !== "idle")
      return false;
    if (!this.isMobileEnvironment())
      return false;
    return shouldStartMobilePressDrag(e);
  }
  shouldDisableMobileTextLongPressDragInInputState() {
    if (!this.view.hasFocus)
      return false;
    return this.view.state.selection.main.empty;
  }
  shouldDismissMobileEditorInputStateForPointerDown(target) {
    if (!this.shouldDisableMobileTextLongPressDragInInputState())
      return false;
    if (!target)
      return true;
    return this.view.dom.contains(target);
  }
  dismissMobileEditorInputState() {
    if (!this.view.hasFocus)
      return;
    this.view.contentDOM.blur();
  }
  isShiftRangeSelectionPointerDown(e) {
    return e.shiftKey === true;
  }
  beginRangeSelectionSession(blockInfo, e, handle, options) {
    var _a, _b;
    const committedBlocksSnapshot = cloneSelectedBlocks((_b = (_a = this.committedRangeSelection) == null ? void 0 : _a.blocks) != null ? _b : []);
    const pointerType = e.pointerType || null;
    const skipLongPress = (options == null ? void 0 : options.skipLongPress) === true;
    const config = resolveRangeSelectConfig(
      pointerType,
      MOUSE_RANGE_SELECT_LONG_PRESS_MS,
      () => this.getTouchRangeSelectLongPressMs()
    );
    const shouldDeferInterception = pointerType === "mouse" && !skipLongPress;
    const initialRangeSelectState = createInitialRangeSelectionState({
      blockInfo,
      doc: this.view.state.doc,
      committedBlocksSnapshot,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      pointerType,
      initialOperation: options == null ? void 0 : options.initialOperation
    });
    if (!initialRangeSelectState)
      return;
    const preferLongPressDrag = pointerType === "mouse" && skipLongPress && initialRangeSelectState.operation === "remove" && !!this.committedRangeSelection;
    initialRangeSelectState.preferLongPressDrag = preferLongPressDrag;
    if (preferLongPressDrag) {
      initialRangeSelectState.dragReady = false;
    }
    initialRangeSelectState.longPressReady = skipLongPress;
    let dragTimeoutId = null;
    if (pointerType !== "mouse") {
      dragTimeoutId = window.setTimeout(() => {
        if (this.gesture.phase !== "range_selecting")
          return;
        const state = this.gesture.rangeSelect;
        if (state.pointerId !== e.pointerId)
          return;
        state.dragReady = true;
        this.emitPressPendingLifecycle(state.directDragSourceBlock, state.pointerType, true);
      }, MOBILE_DRAG_LONG_PRESS_MS);
    } else if (preferLongPressDrag) {
      dragTimeoutId = window.setTimeout(() => {
        if (this.gesture.phase !== "range_selecting")
          return;
        const state = this.gesture.rangeSelect;
        if (state.pointerId !== e.pointerId)
          return;
        if (!state.preferLongPressDrag || state.selectionGestureStarted)
          return;
        state.dragReady = true;
        this.emitPressPendingLifecycle(state.activeSelectionBlock, state.pointerType, true);
      }, MOUSE_RANGE_SELECT_LONG_PRESS_MS);
    }
    if (!shouldDeferInterception) {
      e.preventDefault();
      e.stopPropagation();
      this.pointer.tryCapturePointer(e);
    }
    const timeoutId = skipLongPress ? null : window.setTimeout(() => {
      if (this.gesture.phase !== "range_selecting")
        return;
      const state = this.gesture.rangeSelect;
      if (state.pointerId !== e.pointerId)
        return;
      state.longPressReady = true;
      this.emitPressPendingLifecycle(state.activeSelectionBlock, state.pointerType, true);
      this.activateMouseRangeSelectInterception(state);
      this.updateMouseRangeSelectionFromLine(state, state.currentLineNumber);
    }, config.longPressMs);
    initialRangeSelectState.isIntercepting = !shouldDeferInterception;
    initialRangeSelectState.timeoutId = timeoutId;
    initialRangeSelectState.dragTimeoutId = dragTimeoutId;
    this.gesture = {
      phase: "range_selecting",
      rangeSelect: initialRangeSelectState
    };
    this.pointer.attachPointerListeners();
    const isPressReady = skipLongPress && !preferLongPressDrag;
    this.emitPressPendingLifecycle(blockInfo, pointerType, isPressReady);
    if (skipLongPress && !preferLongPressDrag) {
      this.updateMouseRangeSelectionFromLine(initialRangeSelectState, initialRangeSelectState.currentLineNumber);
    }
  }
  activateMouseRangeSelectInterception(state) {
    this.pointer.tryCapturePointerById(state.pointerId);
    if (state.isIntercepting)
      return;
    state.isIntercepting = true;
  }
  beginPressPendingDrag(blockInfo, e, options) {
    const pointerType = e.pointerType || null;
    const suppressNativeInteraction = (options == null ? void 0 : options.deferInterception) !== true;
    if (suppressNativeInteraction) {
      e.preventDefault();
      e.stopPropagation();
      this.pointer.tryCapturePointer(e);
      if (pointerType !== "mouse") {
        this.mobile.lockMobileInteraction();
        this.mobile.attachFocusGuard();
        this.mobile.suppressMobileKeyboard();
      }
    }
    const skipLongPress = (options == null ? void 0 : options.skipLongPress) === true;
    const longPressMs = pointerType === "mouse" ? MOUSE_RANGE_SELECT_LONG_PRESS_MS : MOBILE_DRAG_LONG_PRESS_MS;
    const timeoutId = skipLongPress ? null : window.setTimeout(() => {
      if (this.gesture.phase !== "press_pending")
        return;
      const state = this.gesture.press;
      if (state.pointerId !== e.pointerId)
        return;
      state.longPressReady = true;
      if (!state.suppressNativeInteraction) {
        state.suppressNativeInteraction = true;
        if (state.pointerType !== "mouse") {
          this.mobile.lockMobileInteraction();
          this.mobile.attachFocusGuard();
          this.mobile.suppressMobileKeyboard();
        }
        this.pointer.tryCapturePointerById(state.pointerId);
      }
      this.emitPressPendingLifecycle(state.sourceBlock, state.pointerType, true);
    }, longPressMs);
    const startMoveThresholdPx = skipLongPress ? 2 : pointerType === "mouse" ? 4 : MOBILE_DRAG_START_MOVE_THRESHOLD_PX;
    this.gesture = { phase: "press_pending", press: {
      sourceBlock: blockInfo,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      latestX: e.clientX,
      latestY: e.clientY,
      pointerType,
      longPressReady: skipLongPress,
      timeoutId,
      cancelMoveThresholdPx: MOBILE_DRAG_CANCEL_MOVE_THRESHOLD_PX,
      startMoveThresholdPx,
      suppressNativeInteraction
    } };
    this.pointer.attachPointerListeners();
    this.emitPressPendingLifecycle(blockInfo, pointerType, skipLongPress);
  }
  clearPointerPressState() {
    if (this.gesture.phase !== "press_pending")
      return;
    const state = this.gesture.press;
    if (state.timeoutId !== null) {
      window.clearTimeout(state.timeoutId);
    }
    this.gesture = { phase: "idle" };
  }
  clearMouseRangeSelectState(options) {
    if (this.gesture.phase !== "range_selecting")
      return;
    const state = this.gesture.rangeSelect;
    if (state.timeoutId !== null) {
      window.clearTimeout(state.timeoutId);
    }
    if (state.dragTimeoutId !== null) {
      window.clearTimeout(state.dragTimeoutId);
    }
    this.gesture = { phase: "idle" };
    if (!(options == null ? void 0 : options.preserveVisual)) {
      if (this.committedRangeSelection) {
        this.rangeVisual.render(
          this.committedRangeSelection.blocks
        );
      } else {
        this.rangeVisual.clear();
      }
    }
  }
  enterDraggingState(sourceBlock, pointerId, clientX, clientY, pointerType) {
    if (this.mobile.isMobileEnvironment()) {
      this.mobile.lockMobileInteraction();
      this.mobile.attachFocusGuard();
      this.mobile.suppressMobileKeyboard();
      this.mobile.triggerMobileHapticFeedback();
    }
    this.pointer.tryCapturePointerById(pointerId);
    this.pointer.attachPointerListeners();
    this.gesture = {
      phase: "dragging",
      drag: {
        sourceBlock,
        pointerId,
        latestX: clientX,
        latestY: clientY,
        pointerType,
        autoScrollFrameId: null
      }
    };
    this.deps.beginPointerDragSession(sourceBlock);
    this.deps.scheduleDropIndicatorUpdate(clientX, clientY, sourceBlock, pointerType);
    this.emitDragStartedLifecycle(sourceBlock, pointerType);
  }
  handlePointerMove(e) {
    switch (this.gesture.phase) {
      case "dragging":
        this.handleDraggingPointerMove(e);
        return;
      case "range_selecting":
        this.handleRangeSelectingPointerMove(e);
        return;
      case "mobile_selecting":
        this.handleMobileSelectingPointerMove(e);
        return;
      case "press_pending":
        this.handlePressPendingPointerMove(e);
        return;
      default:
        return;
    }
  }
  handleDraggingPointerMove(e) {
    if (this.gesture.phase !== "dragging")
      return;
    const dragState = this.gesture.drag;
    if (e.pointerId !== dragState.pointerId)
      return;
    dragState.latestX = e.clientX;
    dragState.latestY = e.clientY;
    dragState.pointerType = e.pointerType || dragState.pointerType;
    e.preventDefault();
    e.stopPropagation();
    this.deps.scheduleDropIndicatorUpdate(e.clientX, e.clientY, dragState.sourceBlock, e.pointerType || null);
    if (this.autoScrollDrag(dragState)) {
      this.scheduleDragAutoScroll(dragState);
    }
  }
  autoScrollDrag(dragState) {
    const didScroll = autoScrollSelectionRange(this.view, dragState.latestY);
    if (didScroll) {
      this.deps.scheduleDropIndicatorUpdate(dragState.latestX, dragState.latestY, dragState.sourceBlock, dragState.pointerType);
    }
    return didScroll;
  }
  scheduleDragAutoScroll(dragState) {
    if (dragState.autoScrollFrameId !== null)
      return;
    dragState.autoScrollFrameId = window.requestAnimationFrame(() => {
      if (this.gesture.phase !== "dragging")
        return;
      const state = this.gesture.drag;
      state.autoScrollFrameId = null;
      if (!this.autoScrollDrag(state))
        return;
      this.scheduleDragAutoScroll(state);
    });
  }
  cancelDragAutoScroll(dragState) {
    if (dragState.autoScrollFrameId === null)
      return;
    window.cancelAnimationFrame(dragState.autoScrollFrameId);
    dragState.autoScrollFrameId = null;
  }
  handleRangeSelectingPointerMove(e) {
    if (this.gesture.phase !== "range_selecting")
      return;
    const rangeState = this.gesture.rangeSelect;
    if (rangeState.pointerId !== -1 && e.pointerId !== rangeState.pointerId)
      return;
    this.handleRangeSelectionPointerMove(e, rangeState);
  }
  handlePressPendingPointerMove(e) {
    if (this.gesture.phase !== "press_pending")
      return;
    const pressState = this.gesture.press;
    if (e.pointerId !== pressState.pointerId)
      return;
    pressState.latestX = e.clientX;
    pressState.latestY = e.clientY;
    const dx = e.clientX - pressState.startX;
    const dy = e.clientY - pressState.startY;
    const distance = Math.hypot(dx, dy);
    if (!pressState.longPressReady) {
      if (distance > pressState.cancelMoveThresholdPx) {
        this.abortForGestureCancel("press_cancelled", e.pointerType || null);
      }
      return;
    }
    if (distance < pressState.startMoveThresholdPx)
      return;
    e.preventDefault();
    e.stopPropagation();
    const sourceBlock = pressState.sourceBlock;
    const pointerId = pressState.pointerId;
    this.clearCommittedRangeSelection();
    this.clearPointerPressState();
    this.enterDraggingState(sourceBlock, pointerId, e.clientX, e.clientY, e.pointerType || null);
  }
  handleRangeSelectionPointerMove(e, state) {
    var _a, _b, _c;
    state.latestX = e.clientX;
    state.latestY = e.clientY;
    const pointerType = (_a = state.pointerType) != null ? _a : e.pointerType || null;
    const distance = Math.hypot(e.clientX - state.startX, e.clientY - state.startY);
    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    if (state.pointerId === -1 && pointerType !== "mouse" && this.mobile.isMostlyVerticalScrollGesture(dx, dy)) {
      this.commitRangeSelection(state);
      this.finishRangeSelectionSession();
      return;
    }
    if (!state.longPressReady) {
      if (pointerType === "mouse") {
        if (distance >= MOUSE_SECONDARY_DRAG_START_MOVE_THRESHOLD_PX) {
          e.preventDefault();
          e.stopPropagation();
          const sourceBlock = state.directDragSourceBlock;
          const pointerId = state.pointerId;
          this.clearCommittedRangeSelection();
          this.clearMouseRangeSelectState();
          this.enterDraggingState(sourceBlock, pointerId, e.clientX, e.clientY, pointerType);
        }
      } else {
        if (!state.dragReady) {
          if (distance > MOBILE_DRAG_CANCEL_MOVE_THRESHOLD_PX) {
            this.abortForGestureCancel("press_cancelled", pointerType);
          }
          return;
        }
        if (distance >= MOBILE_DRAG_START_MOVE_THRESHOLD_PX) {
          e.preventDefault();
          e.stopPropagation();
          const sourceBlock = state.directDragSourceBlock;
          const pointerId = state.pointerId;
          this.clearCommittedRangeSelection();
          this.clearMouseRangeSelectState();
          this.enterDraggingState(sourceBlock, pointerId, e.clientX, e.clientY, pointerType);
        }
      }
      return;
    }
    if (pointerType === "mouse" && state.preferLongPressDrag && !state.selectionGestureStarted) {
      if (!state.dragReady) {
        if (distance < MOUSE_SECONDARY_DRAG_START_MOVE_THRESHOLD_PX) {
          return;
        }
      } else {
        if (distance < MOUSE_SECONDARY_DRAG_START_MOVE_THRESHOLD_PX) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        const sourceBlock = (_b = this.getCommittedSelectionBlock()) != null ? _b : state.activeSelectionBlock;
        const pointerId = state.pointerId;
        this.clearCommittedRangeSelection();
        this.clearMouseRangeSelectState();
        this.enterDraggingState(sourceBlock, pointerId, e.clientX, e.clientY, pointerType);
        return;
      }
    }
    this.activateMouseRangeSelectInterception(state);
    e.preventDefault();
    e.stopPropagation();
    const targetBoundary = (_c = this.resolveHandleRangeBoundaryAtPoint(e.clientX, e.clientY)) != null ? _c : resolveRangeBoundaryAtPoint(this.view, e.clientX, e.clientY, (x, y) => this.deps.getBlockInfoAtPoint(x, y));
    if (targetBoundary) {
      this.updateMouseRangeSelection(state, targetBoundary);
    }
    this.maybeAutoScrollRangeSelection(e.clientY);
  }
  maybeAutoScrollRangeSelection(clientY) {
    autoScrollSelectionRange(this.view, clientY);
  }
  updateMouseRangeSelectionFromLine(state, lineNumber) {
    updateSelectionFromLine(this.view, state, lineNumber, this.rangeVisual);
    state.selectionGestureStarted = true;
  }
  updateMouseRangeSelection(state, target) {
    updateSelectionFromBoundary(this.view, state, target, this.rangeVisual);
    state.selectionGestureStarted = true;
  }
  resolveHandleRangeBoundaryAtPoint(clientX, clientY) {
    if (typeof document === "undefined" || typeof document.elementFromPoint !== "function") {
      return null;
    }
    const hit = document.elementFromPoint(clientX, clientY);
    if (!(hit instanceof HTMLElement))
      return null;
    const handle = hit.closest(`.${DRAG_HANDLE_CLASS}`);
    if (!handle || handle.classList.contains(EMBED_HANDLE_CLASS))
      return null;
    if (!this.view.dom.contains(handle))
      return null;
    const blockInfo = this.deps.getBlockInfoForHandle(handle);
    if (!blockInfo)
      return null;
    return buildRangeSelectionBoundaryFromBlock(this.view.state.doc, blockInfo);
  }
  retargetMobileRangeSelection(e) {
    if (this.gesture.phase !== "range_selecting")
      return;
    const state = this.gesture.rangeSelect;
    if (state.pointerType === "mouse")
      return;
    state.pointerId = e.pointerId;
    state.startX = e.clientX;
    state.startY = e.clientY;
    state.latestX = e.clientX;
    state.latestY = e.clientY;
    state.longPressReady = true;
    state.dragReady = false;
    state.isIntercepting = true;
    if (state.dragTimeoutId !== null) {
      window.clearTimeout(state.dragTimeoutId);
      state.dragTimeoutId = null;
    }
    e.preventDefault();
    e.stopPropagation();
    this.pointer.tryCapturePointer(e);
  }
  retargetActiveMobileRangeSelectionFromHandle(handle, e) {
    var _a;
    if (this.gesture.phase !== "range_selecting")
      return false;
    const state = this.gesture.rangeSelect;
    if (state.pointerType === "mouse")
      return false;
    if (e.pointerType === "mouse")
      return false;
    const blockInfo = (_a = this.deps.getBlockInfoForHandle(handle)) != null ? _a : this.deps.getBlockInfoAtPoint(e.clientX, e.clientY);
    if (!blockInfo)
      return false;
    if (this.deps.isBlockInsideRenderedTableCell(blockInfo))
      return false;
    this.retargetMobileRangeSelection(e);
    this.updateMouseRangeSelection(state, buildRangeSelectionBoundaryFromBlock(this.view.state.doc, blockInfo));
    return true;
  }
  beginMobileSelectionResize(handleEl, e) {
    if (this.gesture.phase !== "mobile_selecting")
      return false;
    if (e.pointerType === "mouse")
      return false;
    const rawHandle = handleEl.getAttribute("data-dnd-mobile-selection-handle");
    if (rawHandle !== "top" && rawHandle !== "bottom")
      return false;
    const state = this.gesture.mobileSelect;
    state.activeInteraction = {
      type: "resize",
      pointerId: e.pointerId
    };
    this.startMobileSelectionResize(state, rawHandle);
    e.preventDefault();
    e.stopPropagation();
    this.pointer.tryCapturePointer(e);
    this.pointer.attachPointerListeners();
    this.mobile.lockMobileInteraction();
    this.mobile.attachFocusGuard();
    this.mobile.suppressMobileKeyboard(e.target);
    return true;
  }
  beginMobileSelectionDrag(handleEl, e) {
    if (this.gesture.phase !== "mobile_selecting")
      return false;
    if (e.pointerType === "mouse")
      return false;
    if (!handleEl.classList.contains("dnd-range-selected-handle"))
      return false;
    const sourceBlock = this.getCommittedSelectionBlock();
    if (!sourceBlock)
      return false;
    const state = this.gesture.mobileSelect;
    state.activeInteraction = {
      type: "drag",
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      sourceBlock
    };
    e.preventDefault();
    e.stopPropagation();
    this.pointer.tryCapturePointer(e);
    this.pointer.attachPointerListeners();
    this.mobile.lockMobileInteraction();
    this.mobile.attachFocusGuard();
    this.mobile.suppressMobileKeyboard(e.target);
    return true;
  }
  handleMobileSelectionTextPointerDown(e) {
    if (this.gesture.phase !== "mobile_selecting")
      return false;
    const state = this.gesture.mobileSelect;
    const blockInfo = this.deps.getBlockInfoAtPoint(e.clientX, e.clientY);
    e.preventDefault();
    e.stopPropagation();
    if (!blockInfo || this.deps.isBlockInsideRenderedTableCell(blockInfo)) {
      this.exitMobileSelectionMode();
      return true;
    }
    const boundary = buildRangeSelectionBoundaryFromBlock(this.view.state.doc, blockInfo);
    const blockRange = {
      startLineNumber: boundary.startLineNumber,
      endLineNumber: boundary.endLineNumber
    };
    const nextBlocks = isSelectedBlockCoveredByBlocks(this.view.state.doc.lines, blockRange, state.selectedBlocks) ? subtractSelectedBlocks(this.view.state.doc.lines, state.selectedBlocks, [blockRange]) : mergeSelectedBlocks(this.view.state.doc.lines, [...state.selectedBlocks, blockRange]);
    if (nextBlocks.length === 0) {
      this.exitMobileSelectionMode();
      return true;
    }
    state.selectedBlocks = nextBlocks;
    state.activeFixedBoundary = boundary;
    state.activeMovingBoundary = boundary;
    state.activeRangeBlocks = [blockRange];
    this.committedRangeSelection = this.buildCommittedSelectionFromBlocks(state.selectedBlocks, blockInfo);
    this.renderMobileSelection(state.selectedBlocks);
    return true;
  }
  handleMobileSelectingPointerMove(e) {
    if (this.gesture.phase !== "mobile_selecting")
      return;
    const state = this.gesture.mobileSelect;
    const interaction = state.activeInteraction;
    if (!interaction || e.pointerId !== interaction.pointerId)
      return;
    e.preventDefault();
    e.stopPropagation();
    if (interaction.type === "drag") {
      const distance = Math.hypot(e.clientX - interaction.startX, e.clientY - interaction.startY);
      if (distance < MOBILE_DRAG_START_MOVE_THRESHOLD_PX)
        return;
      const sourceBlock = interaction.sourceBlock;
      state.activeInteraction = null;
      this.committedRangeSelection = this.buildCommittedSelectionFromBlocks(
        state.selectedBlocks,
        sourceBlock
      );
      this.gesture = {
        phase: "dragging",
        drag: {
          sourceBlock,
          pointerId: interaction.pointerId,
          latestX: e.clientX,
          latestY: e.clientY,
          pointerType: e.pointerType || null,
          autoScrollFrameId: null
        }
      };
      this.mobile.triggerMobileHapticFeedback();
      this.deps.beginPointerDragSession(sourceBlock);
      this.deps.scheduleDropIndicatorUpdate(e.clientX, e.clientY, sourceBlock, e.pointerType || null);
      this.emitDragStartedLifecycle(sourceBlock, e.pointerType || null);
      return;
    }
    const targetBoundary = this.resolveMobileSelectionBoundaryAtPoint(e.clientX, e.clientY);
    if (!targetBoundary)
      return;
    this.updateMobileSelectionResize(state, targetBoundary);
    this.maybeAutoScrollRangeSelection(e.clientY);
  }
  startMobileSelectionResize(state, handle) {
    const selectedBlocks = mergeSelectedBlocks(this.view.state.doc.lines, state.selectedBlocks);
    if (selectedBlocks.length === 0)
      return;
    const firstBlock = selectedBlocks[0];
    const lastBlock = selectedBlocks[selectedBlocks.length - 1];
    state.activeRangeBlocks = selectedBlocks;
    state.activeFixedBoundary = this.buildMobileSelectionResizeBoundary(handle === "top" ? lastBlock : firstBlock);
    state.activeMovingBoundary = this.buildMobileSelectionResizeBoundary(handle === "top" ? firstBlock : lastBlock);
  }
  updateMobileSelectionResize(state, movingBoundary) {
    const activeBlocks = collectSelectedBlocksBetween(
      this.view.state,
      state.activeFixedBoundary.startLineNumber,
      state.activeFixedBoundary.endLineNumber,
      movingBoundary.startLineNumber,
      movingBoundary.endLineNumber
    );
    const baseBlocks = this.removeActiveMobileSelectionBlocks(state.selectedBlocks, state.activeRangeBlocks);
    state.activeMovingBoundary = movingBoundary;
    state.activeRangeBlocks = activeBlocks;
    state.selectedBlocks = mergeSelectedBlocks(this.view.state.doc.lines, [...baseBlocks, ...activeBlocks]);
    this.committedRangeSelection = this.buildCommittedSelectionFromBlocks(state.selectedBlocks, this.getMobileSelectionTemplateBlock(state));
    this.renderMobileSelection(state.selectedBlocks);
  }
  removeActiveMobileSelectionBlocks(selectedBlocks, activeRangeBlocks) {
    return selectedBlocks.filter((block) => !activeRangeBlocks.some((active) => active.startLineNumber === block.startLineNumber && active.endLineNumber === block.endLineNumber));
  }
  buildMobileSelectionResizeBoundary(block) {
    return {
      startLineNumber: block.startLineNumber,
      endLineNumber: block.endLineNumber,
      representativeLineNumber: block.startLineNumber
    };
  }
  finishMobileSelectionPointer(e, mode) {
    if (this.gesture.phase !== "mobile_selecting")
      return;
    const state = this.gesture.mobileSelect;
    const interaction = state.activeInteraction;
    if (!interaction || e.pointerId !== interaction.pointerId)
      return;
    if (mode === "up") {
      e.preventDefault();
      e.stopPropagation();
    }
    state.activeInteraction = null;
    this.pointer.releasePointerCapture();
    if (!this.hasMobileSelection()) {
      this.exitMobileSelectionMode();
    }
  }
  hasMobileSelection() {
    return this.gesture.phase === "mobile_selecting" && this.gesture.mobileSelect.selectedBlocks.length > 0;
  }
  resolveMobileSelectionBoundaryAtPoint(clientX, clientY) {
    const contentRect = this.view.contentDOM.getBoundingClientRect();
    const probeXs = this.resolveMobileSelectionProbeXs(clientX, contentRect);
    for (const probeX of probeXs) {
      const lineNumber = this.resolveLineNumberAtMobileSelectionPoint(probeX, clientY, contentRect);
      if (lineNumber === null)
        continue;
      const boundary = resolveBlockBoundaryAtLine(this.view.state, lineNumber);
      return {
        startLineNumber: boundary.startLineNumber,
        endLineNumber: boundary.endLineNumber,
        representativeLineNumber: lineNumber
      };
    }
    for (const probeX of probeXs) {
      const boundary = resolveRangeBoundaryAtPoint(
        this.view,
        probeX,
        clientY,
        (x, y) => this.deps.getBlockInfoAtPoint(x, y)
      );
      if (boundary)
        return boundary;
    }
    return null;
  }
  resolveMobileSelectionProbeXs(clientX, contentRect) {
    const values = [clientX];
    if (Number.isFinite(contentRect.left) && Number.isFinite(contentRect.right) && contentRect.right > contentRect.left) {
      values.push((contentRect.left + contentRect.right) / 2);
      values.push(contentRect.left + Math.min(48, Math.max(8, (contentRect.right - contentRect.left) * 0.12)));
    }
    return [...new Set(values.map((value) => Math.round(value)))];
  }
  resolveLineNumberAtMobileSelectionPoint(clientX, clientY, contentRect) {
    if (Number.isFinite(contentRect.left) && Number.isFinite(contentRect.right) && contentRect.right > contentRect.left) {
      const x = Math.max(contentRect.left + 2, Math.min(contentRect.right - 2, clientX));
      const pos = safePosAtCoords(this.view, { x, y: clientY });
      if (pos !== null)
        return resolveLineNumberFromPos(this.view, pos);
    }
    const fallbackPos = safePosAtCoords(this.view, { x: clientX, y: clientY });
    return fallbackPos === null ? null : resolveLineNumberFromPos(this.view, fallbackPos);
  }
  getMobileSelectionTemplateBlock(state) {
    var _a;
    const line = this.view.state.doc.line(state.activeMovingBoundary.representativeLineNumber);
    return (_a = this.deps.getBlockInfoAtPoint(0, this.resolveLineClientY(line.number))) != null ? _a : {
      type: "paragraph" /* Paragraph */,
      startLine: line.number - 1,
      endLine: line.number - 1,
      from: line.from,
      to: line.to,
      indentLevel: 0,
      content: line.text
    };
  }
  resolveLineClientY(lineNumber) {
    const line = this.view.state.doc.line(Math.max(1, Math.min(this.view.state.doc.lines, lineNumber)));
    const coords = this.view.coordsAtPos(line.from, 1);
    return coords ? (coords.top + coords.bottom) / 2 : 0;
  }
  buildCommittedSelectionFromBlocks(blocks, template) {
    const selectedBlocks = mergeSelectedBlocks(this.view.state.doc.lines, blocks);
    if (selectedBlocks.length === 0)
      return null;
    return {
      selectedBlock: buildDragSourceBlockFromBlocks(this.view.state.doc, selectedBlocks, template),
      blocks: selectedBlocks
    };
  }
  renderMobileSelection(blocks) {
    this.rangeVisual.render(blocks, { highlightLines: true, showMobileResizeHandles: true });
  }
  exitMobileSelectionMode() {
    if (this.gesture.phase !== "mobile_selecting")
      return;
    this.gesture.mobileSelect.activeInteraction = null;
    this.pointer.detachPointerListeners();
    this.pointer.releasePointerCapture();
    this.mobile.unlockMobileInteraction();
    this.mobile.detachFocusGuard();
    this.gesture = { phase: "idle" };
    this.clearCommittedRangeSelection();
    this.emitIdleLifecycle();
  }
  commitRangeSelection(state) {
    this.committedRangeSelection = commitSelectionRange(this.view, state, this.rangeVisual);
  }
  clearCommittedRangeSelection() {
    this.committedRangeSelection = clearCommittedSelectionRange(this.committedRangeSelection, this.rangeVisual);
  }
  deleteCommittedRangeSelection() {
    this.committedRangeSelection = deleteCommittedSelectionRange(
      this.view,
      this.committedRangeSelection,
      this.rangeVisual
    );
  }
  getCommittedSelectionBlock() {
    return cloneCommittedSelectionBlock(this.committedRangeSelection);
  }
  refreshRangeSelectionVisual() {
    refreshSelectionVisual(this.gesture, this.committedRangeSelection, this.rangeVisual);
  }
  finishRangeSelectionSession() {
    this.clearMouseRangeSelectState({ preserveVisual: true });
    this.pointer.detachPointerListeners();
    this.pointer.releasePointerCapture();
    this.mobile.unlockMobileInteraction();
    this.mobile.detachFocusGuard();
    this.emitIdleLifecycle();
  }
  shouldClearCommittedSelectionOnPointerDown(target, clientX, pointerType) {
    return shouldClearCommittedSelectionOnPointerDown({
      committedSelection: this.committedRangeSelection,
      target,
      clientX,
      pointerType,
      resolveAnchorSpan: (range) => this.rangeVisual.resolveRangeAnchorSpan(range),
      isWithinContentTolerance: (x) => this.mobile.isWithinContentTolerance(x),
      contentDOM: this.view.contentDOM
    });
  }
  isSelectionDragGripHit(target, clientX, clientY, pointerType) {
    return isCommittedSelectionGripHit({
      committedSelection: this.committedRangeSelection,
      target,
      clientX,
      clientY,
      pointerType,
      resolveAnchorSpan: (range) => this.rangeVisual.resolveRangeAnchorSpan(range),
      isWithinMobileDragHotzoneBand: () => true
    });
  }
  finishPointerDrag(e, shouldDrop) {
    if (this.gesture.phase !== "dragging")
      return;
    const state = this.gesture.drag;
    if (e.pointerId !== state.pointerId)
      return;
    e.preventDefault();
    e.stopPropagation();
    if (shouldDrop) {
      this.deps.performDropAtPoint(state.sourceBlock, e.clientX, e.clientY, e.pointerType || null);
    }
    this.resetInteractionSession({
      shouldFinishDragSession: true,
      shouldHideDropIndicator: true,
      cancelReason: shouldDrop ? null : "pointer_cancelled",
      pointerType: e.pointerType || null
    });
  }
  handlePointerUp(e) {
    this.handlePointerTerminalEvent(e, "up");
  }
  handlePointerCancel(e) {
    this.handlePointerTerminalEvent(e, "cancel");
  }
  handleLostPointerCapture(e) {
    if (!this.hasActivePointerSession())
      return;
    if (this.gesture.phase === "mobile_selecting") {
      this.finishMobileSelectionPointer(e, "cancel");
      return;
    }
    this.abortForSessionInterrupted(e.pointerType || null);
  }
  handleWindowBlur() {
    if (!this.hasActivePointerSession())
      return;
    this.abortForSessionInterrupted(null);
  }
  handleDocumentVisibilityChange() {
    if (document.visibilityState !== "hidden")
      return;
    if (!this.hasActivePointerSession())
      return;
    this.abortForSessionInterrupted(null);
  }
  handleWindowKeyDown(e) {
    if (e.key !== "Escape")
      return;
    if (!this.clearRangeSelectionForEscape())
      return;
    e.preventDefault();
    e.stopPropagation();
  }
  clearRangeSelectionForEscape() {
    if (this.gesture.phase === "range_selecting") {
      this.clearMouseRangeSelectState();
      this.pointer.detachPointerListeners();
      this.pointer.releasePointerCapture();
      this.mobile.unlockMobileInteraction();
      this.mobile.detachFocusGuard();
      this.clearCommittedRangeSelection();
      this.emitIdleLifecycle();
      return true;
    }
    if (this.gesture.phase === "idle" && this.committedRangeSelection) {
      this.clearCommittedRangeSelection();
      return true;
    }
    return false;
  }
  handlePointerTerminalEvent(e, mode) {
    switch (this.gesture.phase) {
      case "dragging":
        this.handleDraggingPointerTerminalEvent(e, mode);
        return;
      case "range_selecting":
        this.handleRangeSelectingPointerTerminalEvent(e, mode);
        return;
      case "mobile_selecting":
        this.finishMobileSelectionPointer(e, mode);
        return;
      case "press_pending":
        this.handlePressPendingPointerTerminalEvent(e, mode);
        return;
      default:
        return;
    }
  }
  handleDraggingPointerTerminalEvent(e, mode) {
    this.finishPointerDrag(e, mode === "up");
  }
  handleRangeSelectingPointerTerminalEvent(e, mode) {
    var _a, _b;
    if (this.gesture.phase !== "range_selecting")
      return;
    const rangeState = this.gesture.rangeSelect;
    if (rangeState.pointerId !== -1 && e.pointerId !== rangeState.pointerId)
      return;
    if (mode === "cancel") {
      this.abortForGestureCancel("pointer_cancelled", e.pointerType || null);
      return;
    }
    if (!rangeState.longPressReady) {
      if (mode === "up" && rangeState.pointerType === "mouse") {
        e.preventDefault();
        e.stopPropagation();
        (_b = (_a = this.deps).openBlockTypeMenu) == null ? void 0 : _b.call(_a, rangeState.activeSelectionBlock, e);
        this.finishRangeSelectionSession();
        return;
      }
      this.abortForGestureCancel("press_cancelled", e.pointerType || null);
      return;
    }
    if (rangeState.preferLongPressDrag && rangeState.dragReady && !rangeState.selectionGestureStarted) {
      this.finishRangeSelectionSession();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.commitRangeSelection(rangeState);
    this.finishRangeSelectionSession();
  }
  handlePressPendingPointerTerminalEvent(e, mode) {
    if (this.gesture.phase !== "press_pending")
      return;
    const pressState = this.gesture.press;
    if (e.pointerId !== pressState.pointerId)
      return;
    this.abortForGestureCancel(mode === "up" ? "press_cancelled" : "pointer_cancelled", e.pointerType || null);
  }
  abortForGestureCancel(cancelReason, pointerType) {
    this.resetInteractionSession({
      shouldFinishDragSession: false,
      shouldHideDropIndicator: false,
      cancelReason,
      pointerType
    });
  }
  abortForSessionInterrupted(pointerType) {
    this.resetInteractionSession({
      shouldFinishDragSession: true,
      shouldHideDropIndicator: true,
      cancelReason: "session_interrupted",
      pointerType
    });
  }
  handleEnterMobileSelectionMode(e) {
    if (!this.isMobileEnvironment())
      return;
    if (!this.isMultiLineSelectionEnabled())
      return;
    if (this.gesture.phase !== "idle")
      return;
    const line = this.view.state.doc.lineAt(this.view.state.selection.main.head);
    const boundaryAtCursor = resolveBlockBoundaryAtLine(this.view.state, line.number);
    const startLine = this.view.state.doc.line(boundaryAtCursor.startLineNumber);
    const endLine = this.view.state.doc.line(boundaryAtCursor.endLineNumber);
    const blockInfo = {
      type: "paragraph" /* Paragraph */,
      startLine: boundaryAtCursor.startLineNumber - 1,
      endLine: boundaryAtCursor.endLineNumber - 1,
      from: startLine.from,
      to: endLine.to,
      indentLevel: 0,
      content: this.view.state.doc.sliceString(startLine.from, endLine.to)
    };
    if (this.deps.isBlockInsideRenderedTableCell(blockInfo))
      return;
    if (e instanceof CustomEvent && e.detail && typeof e.detail === "object") {
      e.detail.handled = true;
    }
    const boundary = buildRangeSelectionBoundaryFromBlock(this.view.state.doc, blockInfo);
    const selectedBlock = {
      startLineNumber: boundary.startLineNumber,
      endLineNumber: boundary.endLineNumber
    };
    this.committedRangeSelection = this.buildCommittedSelectionFromBlocks([selectedBlock], blockInfo);
    this.gesture = {
      phase: "mobile_selecting",
      mobileSelect: {
        selectedBlocks: [selectedBlock],
        activeFixedBoundary: boundary,
        activeMovingBoundary: boundary,
        activeRangeBlocks: [selectedBlock],
        activeInteraction: null
      }
    };
    this.renderMobileSelection([selectedBlock]);
    this.mobile.lockMobileInteraction();
    this.mobile.attachFocusGuard();
    this.mobile.suppressMobileKeyboard(document.activeElement);
    this.emitPressPendingLifecycle(blockInfo, "touch", true);
  }
  handleDocumentFocusIn(e) {
    if (this.committedRangeSelection && this.gesture.phase !== "mobile_selecting" && this.isMobileEnvironment() && e.target instanceof HTMLElement && this.mobile.shouldSuppressFocusTarget(e.target)) {
      this.clearCommittedRangeSelection();
    }
    if (!this.shouldSuppressNativeInteractionForActiveGesture())
      return;
    this.mobile.suppressMobileKeyboard(e.target);
  }
  handleTouchMove(e) {
    if (!this.shouldSuppressNativeInteractionForActiveGesture())
      return;
    if (e.cancelable) {
      e.preventDefault();
    }
  }
  hasActivePointerSession() {
    switch (this.gesture.phase) {
      case "dragging":
      case "range_selecting":
      case "press_pending":
        return true;
      case "mobile_selecting":
        return this.gesture.mobileSelect.activeInteraction !== null;
      default:
        return false;
    }
  }
  shouldSuppressNativeInteractionForActiveGesture() {
    switch (this.gesture.phase) {
      case "dragging":
        return true;
      case "range_selecting":
        return this.gesture.rangeSelect.isIntercepting;
      case "mobile_selecting":
        return this.gesture.mobileSelect.activeInteraction !== null;
      case "press_pending":
        return this.gesture.press.suppressNativeInteraction;
      default:
        return false;
    }
  }
  resetInteractionSession(options) {
    var _a, _b, _c, _d;
    const { sourceBlock, hadDrag } = this.resolveSessionResetContext();
    const shouldFinishDragSession = (_a = options == null ? void 0 : options.shouldFinishDragSession) != null ? _a : hadDrag;
    const shouldHideDropIndicator = (_b = options == null ? void 0 : options.shouldHideDropIndicator) != null ? _b : hadDrag;
    const cancelReason = (_c = options == null ? void 0 : options.cancelReason) != null ? _c : null;
    const pointerType = (_d = options == null ? void 0 : options.pointerType) != null ? _d : null;
    this.gesture = { phase: "idle" };
    this.pointer.detachPointerListeners();
    this.pointer.releasePointerCapture();
    this.mobile.unlockMobileInteraction();
    this.mobile.detachFocusGuard();
    if (shouldHideDropIndicator) {
      this.deps.hideDropIndicator();
    }
    if (hadDrag && shouldFinishDragSession) {
      this.deps.finishDragSession();
    }
    if (cancelReason && sourceBlock) {
      this.emitCancelledLifecycle(sourceBlock, cancelReason, pointerType);
    }
    this.emitIdleLifecycle();
  }
  resolveSessionResetContext() {
    const gesture = this.gesture;
    switch (gesture.phase) {
      case "dragging":
        this.cancelDragAutoScroll(gesture.drag);
        return {
          sourceBlock: gesture.drag.sourceBlock,
          hadDrag: true
        };
      case "press_pending":
        this.clearPointerPressState();
        return {
          sourceBlock: gesture.press.sourceBlock,
          hadDrag: false
        };
      case "range_selecting":
        this.clearMouseRangeSelectState();
        return {
          sourceBlock: gesture.rangeSelect.activeSelectionBlock,
          hadDrag: false
        };
      case "mobile_selecting":
        this.clearCommittedRangeSelection();
        return {
          sourceBlock: this.getMobileSelectionTemplateBlock(gesture.mobileSelect),
          hadDrag: false
        };
      default:
        return {
          sourceBlock: null,
          hadDrag: false
        };
    }
  }
  emitLifecycle(event) {
    var _a, _b;
    (_b = (_a = this.deps).onDragLifecycleEvent) == null ? void 0 : _b.call(_a, event);
  }
  emitPressPendingLifecycle(sourceBlock, pointerType, pressReady) {
    this.emitLifecycle(buildPressPendingLifecycleEvent(sourceBlock, pointerType, pressReady));
  }
  emitDragStartedLifecycle(sourceBlock, pointerType) {
    this.emitLifecycle(buildDragStartedLifecycleEvent(sourceBlock, pointerType));
  }
  emitCancelledLifecycle(sourceBlock, rejectReason, pointerType) {
    this.emitLifecycle(buildCancelledLifecycleEvent({
      sourceBlock,
      rejectReason,
      pointerType
    }));
  }
  emitIdleLifecycle() {
    this.emitLifecycle(buildIdleLifecycleEvent());
  }
  isMultiLineSelectionEnabled() {
    if (!this.deps.isMultiLineSelectionEnabled)
      return true;
    return this.deps.isMultiLineSelectionEnabled();
  }
  isMobileTextLongPressDragEnabled() {
    if (!this.deps.isMobileTextLongPressDragEnabled)
      return true;
    return this.deps.isMobileTextLongPressDragEnabled();
  }
  getTouchRangeSelectLongPressMs() {
    if (!this.deps.getMultiLineSelectionLongPressMs) {
      return TOUCH_RANGE_SELECT_LONG_PRESS_MS;
    }
    const value = this.deps.getMultiLineSelectionLongPressMs();
    if (!Number.isFinite(value)) {
      return TOUCH_RANGE_SELECT_LONG_PRESS_MS;
    }
    return Math.max(
      MIN_TOUCH_RANGE_SELECT_LONG_PRESS_MS,
      Math.min(MAX_TOUCH_RANGE_SELECT_LONG_PRESS_MS, Math.round(value))
    );
  }
};

// src/drag/source/handle-renderer.ts
var import_view = require("@codemirror/view");
function createLineDragHandleElement(block) {
  const handle = document.createElement("div");
  handle.className = `${DRAG_HANDLE_CLASS} ${LINE_HANDLE_CLASS} dnd-handle-gutter-bound`;
  handle.setAttribute("data-block-start", String(block.startLine));
  handle.setAttribute("data-block-end", String(block.endLine));
  const core = document.createElement("span");
  core.className = HANDLE_CORE_CLASS;
  core.setAttribute("aria-hidden", "true");
  handle.appendChild(core);
  return handle;
}
function getVisibleHandleForBlockStart(view, blockStart) {
  const handle = view.dom.querySelector(
    `.${DRAG_HANDLE_CLASS}.${LINE_HANDLE_CLASS}[data-block-start="${blockStart}"]`
  );
  if (!handle || !handle.isConnected)
    return null;
  if (handle.closest(".cm-editor") !== view.dom)
    return null;
  return handle;
}
var HandleGutterLineMarker = class extends import_view.GutterMarker {
  constructor(block) {
    super();
    this.block = block;
    this.elementClass = "dnd-handle-gutter-marker";
  }
  eq(other) {
    return other instanceof HandleGutterLineMarker && other.block.startLine === this.block.startLine && other.block.endLine === this.block.endLine;
  }
  toDOM(_view) {
    return createLineDragHandleElement(this.block);
  }
};

// src/platform/dom/line-dom.ts
function getMainContentLineElementByDomAtPos(view, lineNumber) {
  if (typeof view.domAtPos !== "function")
    return null;
  try {
    const line = view.state.doc.line(lineNumber);
    const domAtPos = view.domAtPos(line.from);
    const base = domAtPos.node.nodeType === Node.TEXT_NODE ? domAtPos.node.parentElement : domAtPos.node;
    if (!(base instanceof Element))
      return null;
    const lineEl = base.closest(".cm-line");
    if (!lineEl)
      return null;
    if (!view.contentDOM.contains(lineEl))
      return null;
    return lineEl;
  } catch (e) {
    return null;
  }
}
function getMainContentLineElementForLine(view, lineNumber) {
  if (lineNumber < 1 || lineNumber > view.state.doc.lines)
    return null;
  return getMainContentLineElementByDomAtPos(view, lineNumber);
}

// src/drag/source/handle-visibility-controller.ts
var DRAG_SOURCE_LINE_VARIANT_CLASSES = [
  DRAG_SOURCE_LINE_SINGLE_CLASS,
  DRAG_SOURCE_LINE_FIRST_CLASS,
  DRAG_SOURCE_LINE_MIDDLE_CLASS,
  DRAG_SOURCE_LINE_LAST_CLASS
];
var HandleVisibilityController = class {
  constructor(view, deps) {
    this.view = view;
    this.deps = deps;
    this.grabbedLineEls = /* @__PURE__ */ new Set();
    this.grabbedEmbedEls = /* @__PURE__ */ new Set();
    this.grabbedLineRanges = [];
    this.activeHandle = null;
    this.activeHoverBlock = null;
  }
  getActiveHandle() {
    return this.activeHandle;
  }
  clearGrabbedLineNumbers() {
    this.clearGrabbedLineVisualClasses();
    this.grabbedLineRanges = [];
  }
  refreshGrabVisualState() {
    if (this.grabbedLineRanges.length === 0)
      return;
    this.clearGrabbedLineVisualClasses();
    this.applyGrabbedLineVisualState();
  }
  setGrabbedLineNumberRange(startLineNumber, endLineNumber) {
    this.setGrabbedLineRanges([{ startLineNumber, endLineNumber }]);
  }
  enterGrabVisualStateForBlock(blockInfo, handle) {
    this.setActiveVisibleHandle(handle);
    this.setGrabbedLineRanges(this.resolveGrabLineRanges(blockInfo));
  }
  setActiveVisibleHandle(handle) {
    var _a;
    if (this.activeHandle === handle) {
      return;
    }
    if (this.activeHandle) {
      this.activeHandle.classList.remove("is-visible");
    }
    this.activeHandle = handle;
    if (!handle) {
      this.activeHoverBlock = null;
      return;
    }
    if (((_a = this.activeHoverBlock) == null ? void 0 : _a.handle) !== handle) {
      this.activeHoverBlock = null;
    }
    handle.classList.add("is-visible");
  }
  enterGrabVisualState(startLineNumber, endLineNumber, handle) {
    this.setActiveVisibleHandle(handle);
    this.setGrabbedLineNumberRange(startLineNumber, endLineNumber);
  }
  isPointerInHandleInteractionZone(snapshot) {
    return snapshot.withinHandleInteractionZone;
  }
  isPointerInHoverActivationZone(snapshot) {
    return snapshot.withinHoverActivationZone;
  }
  resolveVisibleHandleFromTarget(target) {
    if (!(target instanceof HTMLElement))
      return null;
    const directHandle = target.closest(`.${DRAG_HANDLE_CLASS}`);
    if (!directHandle)
      return null;
    if (this.view.dom.contains(directHandle)) {
      return directHandle;
    }
    return null;
  }
  resolveVisibleHandleFromPointer(snapshot) {
    if (!snapshot.withinHoverActivationZone) {
      this.activeHoverBlock = null;
      return null;
    }
    const cachedHandle = this.resolveActiveHoverBlock(snapshot);
    if (cachedHandle) {
      return cachedHandle;
    }
    const blockInfo = this.deps.getDraggableBlockAtVerticalPosition(snapshot.clientY, snapshot.contentRect);
    if (!blockInfo)
      return null;
    const handle = this.resolveVisibleHandleForBlock(blockInfo);
    if (!handle) {
      this.activeHoverBlock = null;
      return null;
    }
    this.activeHoverBlock = {
      startLineNumber: blockInfo.startLine + 1,
      endLineNumber: blockInfo.endLine + 1,
      handle
    };
    return handle;
  }
  clearGrabbedLineVisualClasses() {
    for (const lineEl of this.grabbedLineEls) {
      lineEl.classList.remove(DRAG_SOURCE_LINE_CLASS);
      lineEl.classList.remove(...DRAG_SOURCE_LINE_VARIANT_CLASSES);
    }
    this.grabbedLineEls.clear();
    for (const embedEl of this.grabbedEmbedEls) {
      embedEl.classList.remove(DRAG_SOURCE_EMBED_CLASS);
    }
    this.grabbedEmbedEls.clear();
  }
  setGrabbedLineRanges(ranges) {
    this.clearGrabbedLineVisualClasses();
    this.grabbedLineRanges = this.normalizeGrabLineRanges(ranges);
    this.applyGrabbedLineVisualState();
  }
  applyGrabbedLineVisualState() {
    if (this.grabbedLineRanges.length === 0)
      return;
    for (const range of this.grabbedLineRanges) {
      const safeStart = Math.max(1, Math.min(this.view.state.doc.lines, range.startLineNumber));
      const safeEnd = Math.max(1, Math.min(this.view.state.doc.lines, range.endLineNumber));
      const from = Math.min(safeStart, safeEnd);
      const to = Math.max(safeStart, safeEnd);
      for (let lineNumber = from; lineNumber <= to; lineNumber++) {
        const lineEl = getMainContentLineElementForLine(this.view, lineNumber);
        if (!lineEl)
          continue;
        lineEl.classList.add(
          DRAG_SOURCE_LINE_CLASS,
          this.getDragSourceLineVariantClass(lineNumber, from, to)
        );
        this.grabbedLineEls.add(lineEl);
      }
    }
    this.applyGrabbedEmbedVisualState();
  }
  getDragSourceLineVariantClass(lineNumber, from, to) {
    if (from === to)
      return DRAG_SOURCE_LINE_SINGLE_CLASS;
    if (lineNumber === from)
      return DRAG_SOURCE_LINE_FIRST_CLASS;
    if (lineNumber === to)
      return DRAG_SOURCE_LINE_LAST_CLASS;
    return DRAG_SOURCE_LINE_MIDDLE_CLASS;
  }
  resolveGrabLineRanges(blockInfo) {
    var _a, _b;
    const composite = (_b = (_a = blockInfo.compositeSelection) == null ? void 0 : _a.ranges) != null ? _b : [];
    if (composite.length === 0) {
      return [{
        startLineNumber: blockInfo.startLine + 1,
        endLineNumber: blockInfo.endLine + 1
      }];
    }
    return composite.map((range) => ({
      startLineNumber: range.startLine + 1,
      endLineNumber: range.endLine + 1
    }));
  }
  applyGrabbedEmbedVisualState() {
    const root = this.view.dom;
    if (!(root instanceof HTMLElement))
      return;
    for (const embed of collectEmbedRoots(this.view, { normalizeToEmbedRoot: true })) {
      const lineNumber = this.resolveEmbedLineNumber(embed);
      if (lineNumber === null)
        continue;
      if (!this.isLineNumberInGrabRanges(lineNumber))
        continue;
      embed.classList.add(DRAG_SOURCE_EMBED_CLASS);
      this.grabbedEmbedEls.add(embed);
    }
  }
  resolveEmbedLineNumber(embed) {
    var _a;
    const probes = [embed];
    if (embed.firstChild)
      probes.push(embed.firstChild);
    if (embed.parentElement)
      probes.push(embed.parentElement);
    if ((_a = embed.parentElement) == null ? void 0 : _a.firstChild)
      probes.push(embed.parentElement.firstChild);
    return resolveLineNumberFromDomNodes(this.view, probes);
  }
  isLineNumberInGrabRanges(lineNumber) {
    return isLineNumberInRanges(lineNumber, this.grabbedLineRanges);
  }
  normalizeGrabLineRanges(ranges) {
    const docLines = this.view.state.doc.lines;
    const merged = mergeLineRanges(docLines, ranges);
    return merged.map((range) => ({
      startLineNumber: range.startLineNumber,
      endLineNumber: range.endLineNumber
    }));
  }
  resolveVisibleHandleForBlock(blockInfo) {
    var _a, _b, _c;
    return (_c = (_b = (_a = this.deps).getVisibleHandleForBlockStart) == null ? void 0 : _b.call(_a, blockInfo.startLine)) != null ? _c : null;
  }
  resolveActiveHoverBlock(snapshot) {
    var _a, _b, _c;
    if (!this.activeHoverBlock)
      return null;
    if (this.activeHandle !== this.activeHoverBlock.handle)
      return null;
    if (!this.activeHoverBlock.handle.isConnected) {
      this.activeHoverBlock = null;
      return null;
    }
    const lineNumber = this.deps.getLineNumberAtVerticalPosition(snapshot.clientY, snapshot.contentRect);
    if (lineNumber === null)
      return null;
    if (lineNumber < this.activeHoverBlock.startLineNumber || lineNumber > this.activeHoverBlock.endLineNumber) {
      return null;
    }
    if (lineNumber === this.activeHoverBlock.startLineNumber) {
      return this.activeHoverBlock.handle;
    }
    const lineHandle = (_c = (_b = (_a = this.deps).getVisibleHandleForBlockStart) == null ? void 0 : _b.call(_a, lineNumber - 1)) != null ? _c : null;
    if (lineHandle && lineHandle !== this.activeHoverBlock.handle) {
      return null;
    }
    return this.activeHoverBlock.handle;
  }
};

// src/shared/constants.ts
var DOC_SEMANTIC_IDLE_SMALL_MS = 500;
var DOC_SEMANTIC_IDLE_MEDIUM_MS = 900;
var DOC_SEMANTIC_IDLE_LARGE_MS = 1400;
var HANDLE_INTERACTION_ZONE_PX = 64;
var DEFAULT_HANDLE_SIZE_PX = 20;
var MIN_HANDLE_SIZE_PX = 10;
var MAX_HANDLE_SIZE_PX = 40;
var HANDLE_CORE_SIZE_RATIO = 0.5;
var GRIP_DOTS_CORE_SIZE_RATIO = 0.8;
var handleConfig = {
  sizePx: DEFAULT_HANDLE_SIZE_PX,
  horizontalOffsetPx: -8
};
function setHandleSizePx(size) {
  handleConfig.sizePx = Math.max(MIN_HANDLE_SIZE_PX, Math.min(MAX_HANDLE_SIZE_PX, size));
}
function setHandleHorizontalOffsetPx(offsetPx) {
  handleConfig.horizontalOffsetPx = Number.isFinite(offsetPx) ? offsetPx : 0;
}

// src/runtime/semantic-refresh-scheduler.ts
var SemanticRefreshScheduler = class {
  constructor(view, deps) {
    this.view = view;
    this.deps = deps;
    this.semanticRefreshTimerHandle = null;
    this.pendingSemanticRefresh = false;
  }
  get isPending() {
    return this.pendingSemanticRefresh;
  }
  markSemanticRefreshPending() {
    this.pendingSemanticRefresh = true;
    if (this.semanticRefreshTimerHandle !== null) {
      window.clearTimeout(this.semanticRefreshTimerHandle);
      this.semanticRefreshTimerHandle = null;
    }
    const delayMs = this.getSemanticRefreshDelayMs(this.view.state.doc.lines);
    this.semanticRefreshTimerHandle = window.setTimeout(() => {
      this.semanticRefreshTimerHandle = null;
      if (document.body.classList.contains(DRAGGING_BODY_CLASS)) {
        this.markSemanticRefreshPending();
        return;
      }
      if (!this.pendingSemanticRefresh)
        return;
      this.deps.performRefresh();
    }, delayMs);
  }
  ensureSemanticReadyForInteraction() {
    if (!this.pendingSemanticRefresh)
      return;
    this.deps.performRefresh();
  }
  clearPendingSemanticRefresh() {
    this.pendingSemanticRefresh = false;
    if (this.semanticRefreshTimerHandle !== null) {
      window.clearTimeout(this.semanticRefreshTimerHandle);
      this.semanticRefreshTimerHandle = null;
    }
  }
  destroy() {
    this.clearPendingSemanticRefresh();
  }
  getSemanticRefreshDelayMs(docLines) {
    if (docLines > 12e4)
      return DOC_SEMANTIC_IDLE_LARGE_MS;
    if (docLines > 3e4)
      return DOC_SEMANTIC_IDLE_MEDIUM_MS;
    return DOC_SEMANTIC_IDLE_SMALL_MS;
  }
};

// src/runtime/perf-session.ts
function createDurationStore() {
  return {
    resolve_total: [],
    vertical: [],
    container: [],
    list_target: [],
    in_place: [],
    geometry: [],
    line_map_get: [],
    line_map_build: [],
    detect_block_uncached: [],
    drop_indicator_resolve: []
  };
}
function createCounterStore() {
  return {
    drop_indicator_frames: 0,
    drop_indicator_skipped_frames: 0,
    drop_indicator_reused_frames: 0,
    resolve_cache_hits: 0,
    resolve_cache_misses: 0,
    list_ancestor_scan_steps: 0,
    list_parent_scan_steps: 0,
    highlight_scan_lines: 0
  };
}
function percentile(values, p) {
  if (values.length === 0)
    return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.max(0, Math.min(sorted.length - 1, Math.ceil(p / 100 * sorted.length) - 1));
  return Number(sorted[index].toFixed(3));
}
function summarize(values) {
  if (values.length === 0) {
    return { count: 0, p50: 0, p95: 0, max: 0 };
  }
  return {
    count: values.length,
    p50: percentile(values, 50),
    p95: percentile(values, 95),
    max: Number(Math.max(...values).toFixed(3))
  };
}
function serializeSnapshot(snapshot) {
  return JSON.stringify(snapshot, null, 2);
}
function createDragPerfSession(input) {
  const startedAtMs = nowMs();
  const durations = createDurationStore();
  const counters = createCounterStore();
  const id = `drag-${Math.random().toString(36).slice(2, 10)}`;
  return {
    id,
    docLines: input.docLines,
    startedAtMs,
    recordDuration(key, durationMs) {
      if (!isFinite(durationMs) || durationMs < 0)
        return;
      durations[key].push(durationMs);
    },
    incrementCounter(key, delta = 1) {
      counters[key] += delta;
    },
    snapshot() {
      const resolveHits = counters.resolve_cache_hits;
      const resolveMisses = counters.resolve_cache_misses;
      const resolveTotal = resolveHits + resolveMisses;
      return {
        id,
        docLines: input.docLines,
        durationMs: Number((nowMs() - startedAtMs).toFixed(3)),
        durations: {
          resolve_total: summarize(durations.resolve_total),
          vertical: summarize(durations.vertical),
          container: summarize(durations.container),
          list_target: summarize(durations.list_target),
          in_place: summarize(durations.in_place),
          geometry: summarize(durations.geometry),
          line_map_get: summarize(durations.line_map_get),
          line_map_build: summarize(durations.line_map_build),
          detect_block_uncached: summarize(durations.detect_block_uncached),
          drop_indicator_resolve: summarize(durations.drop_indicator_resolve)
        },
        counters: { ...counters },
        cacheHitRates: {
          resolveValidatedDropTarget: resolveTotal > 0 ? Number((resolveHits / resolveTotal).toFixed(3)) : 0
        }
      };
    }
  };
}
function logDragPerfSession(session, reason) {
  if (!session)
    return;
  const snapshot = session.snapshot();
  console.debug("[Dragger][Perf]", reason, serializeSnapshot(snapshot));
}

// src/runtime/drag-perf-session-manager.ts
var DragPerfSessionManager = class {
  constructor(view) {
    this.view = view;
    this.session = null;
  }
  ensure() {
    if (this.session)
      return;
    this.session = createDragPerfSession({
      docLines: this.view.state.doc.lines
    });
    setLineMapPerfRecorder((key, durationMs) => {
      var _a;
      (_a = this.session) == null ? void 0 : _a.recordDuration(key, durationMs);
    });
    setDetectBlockPerfRecorder((key, durationMs) => {
      var _a;
      (_a = this.session) == null ? void 0 : _a.recordDuration(key, durationMs);
    });
    getLineMap(this.view.state);
  }
  flush(reason) {
    if (this.session) {
      logDragPerfSession(this.session, reason);
      this.session = null;
    }
    setLineMapPerfRecorder(null);
    setDetectBlockPerfRecorder(null);
  }
  recordDuration(key, durationMs) {
    var _a;
    (_a = this.session) == null ? void 0 : _a.recordDuration(key, durationMs);
  }
  incrementCounter(key, delta = 1) {
    var _a;
    (_a = this.session) == null ? void 0 : _a.incrementCounter(key, delta);
  }
};

// src/domain/markdown/line-parsing-service.ts
var import_state4 = require("@codemirror/state");
var LineParsingService = class {
  constructor(view) {
    this.view = view;
  }
  getTabSize(state) {
    return normalizeTabSize((state != null ? state : this.view.state).facet(import_state4.EditorState.tabSize));
  }
  parseLine(line, state) {
    return parseLineWithQuote2(line, this.getTabSize(state));
  }
  getIndentUnitWidth(sample, state) {
    return getIndentUnitWidth2(sample, this.getTabSize(state));
  }
  getIndentUnitWidthForDoc(doc, state) {
    const activeState = state != null ? state : this.view.state;
    return getIndentUnitWidthForDoc(
      doc,
      (line) => this.parseLine(line, activeState),
      this.getTabSize(activeState)
    );
  }
  buildIndentStringFromSample(sample, width, state) {
    return buildIndentStringFromSample2(sample, width, this.getTabSize(state));
  }
};

// src/platform/codemirror/geometry.ts
var GeometryCalculator = class {
  constructor(view, lineParsingService) {
    this.view = view;
    this.lineParsingService = lineParsingService;
  }
  getAdjustedTargetLocation(lineNumber, options) {
    const doc = this.view.state.doc;
    if (lineNumber < 1 || lineNumber > doc.lines) {
      return { lineNumber: clampTargetLineNumber(doc.lines, lineNumber), blockAdjusted: false };
    }
    const block = detectBlock(this.view.state, lineNumber);
    if (!block || block.type !== "code-block" /* CodeBlock */ && block.type !== "table" /* Table */ && block.type !== "math-block" /* MathBlock */) {
      return { lineNumber, blockAdjusted: false };
    }
    if (typeof (options == null ? void 0 : options.clientY) === "number") {
      const blockStartLine = doc.line(block.startLine + 1);
      const blockEndLine = doc.line(block.endLine + 1);
      const startCoords = getCoordsAtPos(this.view, blockStartLine.from);
      const endCoords = getCoordsAtPos(this.view, blockEndLine.to);
      if (startCoords && endCoords) {
        const midPoint = (startCoords.top + endCoords.bottom) / 2;
        const insertAfter = options.clientY > midPoint;
        const adjustedLineNumber2 = insertAfter ? block.endLine + 2 : block.startLine + 1;
        return {
          lineNumber: clampTargetLineNumber(doc.lines, adjustedLineNumber2),
          blockAdjusted: true
        };
      }
    }
    const lineIndex = lineNumber - 1;
    const midLine = (block.startLine + block.endLine) / 2;
    const adjustedLineNumber = lineIndex <= midLine ? block.startLine + 1 : block.endLine + 2;
    return {
      lineNumber: clampTargetLineNumber(doc.lines, adjustedLineNumber),
      blockAdjusted: true
    };
  }
  getLineRect(lineNumber) {
    return getLineRect(this.view, lineNumber);
  }
  getInsertionAnchorY(lineNumber) {
    return getInsertionAnchorY(this.view, lineNumber);
  }
  getLineIndentPosByWidth(lineNumber, targetIndentWidth) {
    return getLineIndentPosByWidth(
      this.view,
      lineNumber,
      targetIndentWidth,
      this.lineParsingService.getTabSize()
    );
  }
  getBlockRect(startLineNumber, endLineNumber) {
    return getBlockRect(this.view, startLineNumber, endLineNumber);
  }
};

// src/domain/rules/container-policy.ts
var defaultDetectBlock = (state, lineNumber) => detectBlock(state, lineNumber);
function clampInsertionLineNumber(doc, lineNumber) {
  if (lineNumber < 1)
    return 1;
  if (lineNumber > doc.lines + 1)
    return doc.lines + 1;
  return lineNumber;
}
function getImmediateLineText(doc, lineNumber) {
  if (lineNumber < 1 || lineNumber > doc.lines)
    return null;
  return doc.line(lineNumber).text;
}
function getActiveLineMap(state, options) {
  var _a;
  return (_a = options == null ? void 0 : options.lineMap) != null ? _a : getLineMap(state);
}
function getPreviousNonEmptyLineNumber(doc, lineNumber, lineMap) {
  if (lineMap && lineMap.doc === doc) {
    if (doc.lines <= 0)
      return null;
    const clampedLine = Math.max(1, Math.min(doc.lines, lineNumber));
    const prev = lineMap.prevNonEmpty[clampedLine];
    return prev > 0 ? prev : null;
  }
  for (let i = lineNumber; i >= 1; i--) {
    const text = doc.line(i).text;
    if (text.trim().length === 0)
      continue;
    return i;
  }
  return null;
}
function getNextNonEmptyLineNumber(doc, lineNumber, lineMap) {
  if (lineMap && lineMap.doc === doc) {
    if (doc.lines <= 0)
      return null;
    const clampedLine = Math.max(1, Math.min(doc.lines, lineNumber));
    const next = lineMap.nextNonEmpty[clampedLine];
    return next > 0 ? next : null;
  }
  for (let i = lineNumber; i <= doc.lines; i++) {
    const text = doc.line(i).text;
    if (text.trim().length === 0)
      continue;
    return i;
  }
  return null;
}
function findEnclosingListBlock(state, lineNumber, detectBlockFn = defaultDetectBlock, options) {
  const doc = state.doc;
  if (lineNumber < 1 || lineNumber > doc.lines)
    return null;
  const lineMap = getActiveLineMap(state, options);
  const radius = 8;
  const minLine = Math.max(1, lineNumber - radius);
  const maxLine = Math.min(doc.lines, lineNumber + radius);
  let best = null;
  for (let ln = minLine; ln <= maxLine; ln++) {
    const meta = getLineMetaAt(lineMap, ln);
    if (meta && !meta.isList)
      continue;
    const block = detectBlockFn(state, ln);
    if (!block || block.type !== "list-item" /* ListItem */)
      continue;
    const blockStart = block.startLine + 1;
    const blockEnd = block.endLine + 1;
    if (lineNumber < blockStart || lineNumber > blockEnd)
      continue;
    if (!best || block.endLine - block.startLine > best.endLine - best.startLine) {
      best = block;
    }
  }
  return best;
}
function isTableBlockStartAtLine(state, lineNumber, detectBlockFn) {
  if (lineNumber < 1 || lineNumber > state.doc.lines)
    return false;
  const block = detectBlockFn(state, lineNumber);
  return !!block && block.type === "table" /* Table */ && block.startLine + 1 === lineNumber;
}
function isHorizontalRuleAtLine(state, lineNumber, detectBlockFn) {
  if (lineNumber < 1 || lineNumber > state.doc.lines)
    return false;
  const block = detectBlockFn(state, lineNumber);
  if (block) {
    return block.type === "hr" /* HorizontalRule */ && block.startLine + 1 === lineNumber;
  }
  return isHorizontalRuleLine(state.doc.line(lineNumber).text);
}
function isCalloutAfterBoundary(state, prevImmediateLine, nextIsQuoteLike, detectBlockFn) {
  if (prevImmediateLine < 1 || prevImmediateLine > state.doc.lines)
    return false;
  if (nextIsQuoteLike)
    return false;
  const prevBlock = detectBlockFn(state, prevImmediateLine);
  return !!prevBlock && prevBlock.type === "callout" /* Callout */ && prevBlock.endLine + 1 === prevImmediateLine;
}
function resolveListContextAtInsertion(state, targetLineNumber, detectBlockFn, options) {
  const doc = state.doc;
  if (doc.lines <= 0)
    return null;
  const lineMap = getActiveLineMap(state, options);
  const candidates = [
    targetLineNumber - 1,
    targetLineNumber,
    targetLineNumber + 1,
    getPreviousNonEmptyLineNumber(doc, targetLineNumber - 1, lineMap),
    getNextNonEmptyLineNumber(doc, targetLineNumber, lineMap)
  ].filter((v) => typeof v === "number" && v >= 1 && v <= doc.lines);
  const seen = /* @__PURE__ */ new Set();
  let best = null;
  for (const line of candidates) {
    if (seen.has(line))
      continue;
    seen.add(line);
    const lineMeta = getLineMetaAt(lineMap, line);
    if (lineMeta && !lineMeta.isList)
      continue;
    const block = findEnclosingListBlock(state, line, detectBlockFn, { lineMap });
    if (!block)
      continue;
    const blockTopBoundary = block.startLine + 1;
    const blockBottomBoundary = block.endLine + 2;
    const isInsideContainer = targetLineNumber > blockTopBoundary && targetLineNumber < blockBottomBoundary;
    if (!isInsideContainer)
      continue;
    if (!best || block.endLine - block.startLine > best.endLine - best.startLine) {
      best = block;
    }
  }
  if (!best)
    return null;
  return { type: "list-item" /* ListItem */, block: best };
}
function resolveSlotContextAtInsertion(state, targetLineNumber, detectBlockFn = defaultDetectBlock, options) {
  const doc = state.doc;
  const lineMap = getActiveLineMap(state, options);
  const clampedTarget = clampInsertionLineNumber(doc, targetLineNumber);
  const prevImmediateLine = clampedTarget - 1;
  const nextImmediateLine = clampedTarget <= doc.lines ? clampedTarget : null;
  const prevMeta = getLineMetaAt(lineMap, prevImmediateLine);
  const nextMeta = nextImmediateLine === null ? null : getLineMetaAt(lineMap, nextImmediateLine);
  const prevImmediateText = prevMeta ? null : getImmediateLineText(doc, prevImmediateLine);
  const nextImmediateText = nextMeta || nextImmediateLine === null ? null : getImmediateLineText(doc, nextImmediateLine);
  const prevIsQuoteLike = prevMeta ? prevMeta.isQuote : isBlockquoteLine(prevImmediateText);
  const nextIsQuoteLike = nextMeta ? nextMeta.isQuote : isBlockquoteLine(nextImmediateText);
  if (isCalloutAfterBoundary(state, prevImmediateLine, nextIsQuoteLike, detectBlockFn)) {
    return "callout_after";
  }
  if (nextImmediateLine !== null && isTableBlockStartAtLine(state, nextImmediateLine, detectBlockFn)) {
    return "table_before";
  }
  if (nextImmediateLine !== null && isHorizontalRuleAtLine(state, nextImmediateLine, detectBlockFn)) {
    return "hr_before";
  }
  if (prevIsQuoteLike && nextIsQuoteLike) {
    return "inside_quote_run";
  }
  if (!prevIsQuoteLike && nextIsQuoteLike) {
    return "quote_before";
  }
  if (prevIsQuoteLike && !nextIsQuoteLike) {
    return "quote_after";
  }
  const listContext = resolveListContextAtInsertion(
    state,
    clampedTarget,
    detectBlockFn,
    { lineMap }
  );
  if (listContext) {
    return "inside_list";
  }
  return "outside";
}
function resolveDropRuleContextAtInsertion(state, sourceBlock, targetLineNumber, detectBlockFn = defaultDetectBlock, options) {
  const slotContext = resolveSlotContextAtInsertion(state, targetLineNumber, detectBlockFn, options);
  const decision = resolveInsertionRule({
    sourceType: sourceBlock.type,
    slotContext
  });
  return {
    slotContext,
    decision
  };
}

// src/domain/rules/container-policy-service.ts
var ContainerPolicyService = class {
  constructor(view) {
    this.view = view;
  }
  resolveDropRuleAtInsertion(sourceBlock, targetLineNumber, options) {
    var _a;
    const lineMap = (_a = options == null ? void 0 : options.lineMap) != null ? _a : getLineMap(this.view.state);
    return resolveDropRuleContextAtInsertion(
      this.view.state,
      sourceBlock,
      targetLineNumber,
      void 0,
      { lineMap }
    );
  }
  shouldPreventDropIntoDifferentContainer(sourceBlock, targetLineNumber) {
    return !this.resolveDropRuleAtInsertion(sourceBlock, targetLineNumber).decision.allowDrop;
  }
};

// src/domain/mutation/structure-mutation.ts
function buildInsertText(params) {
  const {
    sourceBlockType,
    sourceContent,
    adjustListToTargetContext: adjustListToTargetContextFn
  } = params;
  let text = sourceContent;
  if (sourceBlockType !== "blockquote" /* Blockquote */) {
    text = adjustListToTargetContextFn(text);
  }
  text += "\n";
  return text;
}

// src/domain/mutation/text-mutation-policy.ts
var TextMutationPolicy = class {
  constructor(lineParsingService) {
    this.lineParsingService = lineParsingService;
  }
  parseLineWithQuote(line) {
    return this.lineParsingService.parseLine(line);
  }
  getListContext(doc, lineNumber) {
    return getListContext(doc, lineNumber, (line) => this.parseLineWithQuote(line));
  }
  getIndentUnitWidth(sample) {
    return this.lineParsingService.getIndentUnitWidth(sample);
  }
  getIndentUnitWidthForDoc(doc) {
    return this.lineParsingService.getIndentUnitWidthForDoc(doc);
  }
  buildInsertText(doc, sourceBlock, targetLineNumber, sourceContent, listIntent) {
    return buildInsertText({
      sourceBlockType: sourceBlock.type,
      sourceContent,
      adjustListToTargetContext: (content) => adjustListToTargetContext({
        doc,
        sourceContent: content,
        targetLineNumber,
        parseLineWithQuote: (line) => this.parseLineWithQuote(line),
        getIndentUnitWidth: (sample) => this.getIndentUnitWidth(sample),
        buildIndentStringFromSample: (sample, width) => this.lineParsingService.buildIndentStringFromSample(sample, width),
        buildTargetMarker: (_target, source) => source.marker,
        markerConversionScope: "none",
        getListContext: (activeDoc, lineNumber) => this.getListContext(activeDoc, lineNumber),
        listIntent
      })
    });
  }
};

// src/platform/obsidian/editor-view.ts
function getCodeMirrorView(markdownView) {
  var _a;
  const maybeView = (_a = markdownView.editor) == null ? void 0 : _a.cm;
  return maybeView != null ? maybeView : null;
}

// src/platform/obsidian/editor-markdown-view.ts
function resolveMarkdownViewForEditor(app, editorView) {
  var _a;
  for (const leaf of app.workspace.getLeavesOfType("markdown")) {
    const view = leaf.view;
    if (((_a = view.getViewType) == null ? void 0 : _a.call(view)) !== "markdown")
      continue;
    const markdownView = view;
    if (getCodeMirrorView(markdownView) === editorView) {
      return markdownView;
    }
  }
  return null;
}

// src/platform/obsidian/editor-fold.ts
var TEXT_NODE = 3;
function isElementLike(value) {
  if (!value || typeof value !== "object")
    return false;
  return typeof value.closest === "function";
}
function resolveVisibleLineElement(view, lineNumber) {
  var _a, _b, _c;
  try {
    const line = view.state.doc.line(lineNumber);
    const block = typeof view.lineBlockAt === "function" ? view.lineBlockAt(line.from) : null;
    if (block && typeof block.from === "number" && block.from !== line.from) {
      return null;
    }
    const domAtPos = view.domAtPos(line.from);
    const rawNode = domAtPos.node;
    const base = rawNode.nodeType === TEXT_NODE ? (_a = rawNode.parentElement) != null ? _a : null : rawNode;
    if (!isElementLike(base))
      return null;
    return (_c = (_b = base.closest) == null ? void 0 : _b.call(base, ".cm-line")) != null ? _c : null;
  } catch (e) {
    return null;
  }
}
function isEditorLineCollapsed(view, lineNumber) {
  var _a, _b, _c;
  const lineEl = resolveVisibleLineElement(view, lineNumber);
  if (!lineEl)
    return false;
  if (((_a = lineEl.classList) == null ? void 0 : _a.contains("is-collapsed")) || ((_b = lineEl.classList) == null ? void 0 : _b.contains("cm-folded"))) {
    return true;
  }
  return !!((_c = lineEl.querySelector) == null ? void 0 : _c.call(
    lineEl,
    ".cm-foldPlaceholder, .cm-fold-indicator.is-collapsed, .collapse-indicator.is-collapsed"
  ));
}
function restoreSelectionsAndScroll(editor, selections, scroll) {
  editor.setSelections(selections);
  editor.scrollTo(scroll.left, scroll.top);
}
function toggleLineFolds(params) {
  const { app, view, targetLineNumbers } = params;
  if (targetLineNumbers.length === 0)
    return;
  const markdownView = resolveMarkdownViewForEditor(app, view);
  const editor = markdownView == null ? void 0 : markdownView.editor;
  if (!editor)
    return;
  const selections = editor.listSelections();
  const scroll = editor.getScrollInfo();
  const hadFocus = editor.hasFocus();
  try {
    for (const targetLineNumber of [...new Set(targetLineNumbers)].sort((a, b) => b - a)) {
      if (targetLineNumber < 1 || targetLineNumber > editor.lineCount())
        continue;
      if (isEditorLineCollapsed(view, targetLineNumber))
        continue;
      editor.setCursor({ line: targetLineNumber - 1, ch: 0 });
      editor.exec("toggleFold");
    }
  } finally {
    restoreSelectionsAndScroll(editor, selections, scroll);
    if (!hadFocus && editor.hasFocus()) {
      editor.blur();
    }
  }
}

// src/drag/source/source-resolver.ts
var DragSourceResolver = class {
  constructor(view) {
    this.view = view;
  }
  getBlockInfoForHandle(handle) {
    const startLine = resolveLineNumberFromBlockStartAttribute(this.view, handle);
    if (startLine !== null) {
      const block = this.getDraggableBlockAtLine(startLine);
      if (block)
        return block;
    }
    const lineNumber = resolveLineNumberFromDomNodes(this.view, [handle]);
    if (lineNumber !== null) {
      const block = this.getDraggableBlockAtLine(lineNumber);
      if (block)
        return block;
    }
    return null;
  }
  getDraggableBlockAtLine(lineNumber) {
    const block = detectBlock(this.view.state, lineNumber);
    if (!block)
      return null;
    return this.expandHeadingBlockIfCollapsed(block);
  }
  getLineNumberAtVerticalPosition(clientY, contentRect) {
    const activeContentRect = contentRect != null ? contentRect : this.view.contentDOM.getBoundingClientRect();
    if (clientY < activeContentRect.top || clientY > activeContentRect.bottom)
      return null;
    try {
      const lineBlock = this.view.lineBlockAtHeight(clientY - this.view.documentTop);
      return resolveLineNumberFromPos(this.view, lineBlock.from);
    } catch (e) {
      return null;
    }
  }
  getDraggableBlockAtVerticalPosition(clientY, contentRect) {
    const lineNumber = this.getLineNumberAtVerticalPosition(clientY, contentRect);
    if (lineNumber === null)
      return null;
    return this.getDraggableBlockAtLine(lineNumber);
  }
  getDraggableBlockAtPoint(clientX, clientY) {
    const embedAtPoint = this.getEmbedElementAtPoint(clientX, clientY);
    if (embedAtPoint) {
      const embedBlock = this.getBlockInfoForEmbed(embedAtPoint);
      if (embedBlock)
        return embedBlock;
    }
    const renderedLineNumber = getRenderedMainLineNumberAtPoint(this.view, clientX, clientY);
    if (renderedLineNumber !== null) {
      const renderedBlock = this.getDraggableBlockAtLine(renderedLineNumber);
      if (renderedBlock)
        return renderedBlock;
    }
    const contentRect = this.view.contentDOM.getBoundingClientRect();
    if (clientY < contentRect.top || clientY > contentRect.bottom)
      return null;
    const lineNumber = resolveLineNumberAtCoords(this.view, clientX, clientY, contentRect);
    if (lineNumber === null)
      return null;
    return this.getDraggableBlockAtLine(lineNumber);
  }
  getBlockInfoForEmbed(embedEl) {
    const candidates = this.collectEmbedProbeCandidates(embedEl);
    for (const candidate of candidates) {
      const lineNumber = resolveLineNumberFromDomNodes(this.view, [candidate]);
      if (lineNumber === null)
        continue;
      const block = this.getDraggableBlockAtLine(lineNumber);
      if (block)
        return block;
    }
    return null;
  }
  collectEmbedProbeCandidates(embedEl) {
    const seen = /* @__PURE__ */ new Set();
    const candidates = [];
    const push = (el) => {
      if (!el)
        return;
      if (seen.has(el))
        return;
      seen.add(el);
      candidates.push(el);
    };
    push(embedEl.closest(EMBED_ROOT_SELECTOR));
    push(embedEl.closest(CODEMIRROR_LINE_SELECTOR));
    push(embedEl);
    let current = embedEl.parentElement;
    while (current) {
      push(current);
      if (current === this.view.dom)
        break;
      current = current.parentElement;
    }
    return candidates;
  }
  getEmbedElementAtPoint(clientX, clientY) {
    return findEmbedElementAtPoint(this.view, clientX, clientY, {
      requireDirectWithinRoot: true,
      normalizeToEmbedRoot: true
    });
  }
  expandHeadingBlockIfCollapsed(block) {
    if (block.type !== "heading" /* Heading */)
      return block;
    const headingLineNumber = block.startLine + 1;
    if (!isEditorLineCollapsed(this.view, headingLineNumber))
      return block;
    const range = getHeadingSectionRange(this.view.state.doc, headingLineNumber);
    if (!range || range.endLine <= headingLineNumber)
      return block;
    const endLineObj = this.view.state.doc.line(range.endLine);
    let content = "";
    for (let i = headingLineNumber; i <= range.endLine; i++) {
      content += this.view.state.doc.line(i).text;
      if (i < range.endLine)
        content += "\n";
    }
    return {
      ...block,
      endLine: range.endLine - 1,
      to: endLineObj.to,
      content
    };
  }
};

// src/runtime/drag-service-container.ts
var DragDropServiceContainer = class {
  constructor(view) {
    this.view = view;
    this.dragSource = new DragSourceResolver(view);
    this.lineParsing = new LineParsingService(view);
    this.geometry = new GeometryCalculator(view, this.lineParsing);
    this.containerPolicy = new ContainerPolicyService(view);
    this.textMutation = new TextMutationPolicy(this.lineParsing);
  }
  createDropPlannerDeps(hooks) {
    const sharedDeps = this.createSharedDropPolicyDeps();
    return {
      ...sharedDeps,
      getBlockInfoForEmbed: (el) => this.dragSource.getBlockInfoForEmbed(el),
      getIndentUnitWidthForDoc: (doc) => this.textMutation.getIndentUnitWidthForDoc(doc),
      getLineRect: (ln) => this.geometry.getLineRect(ln),
      getInsertionAnchorY: (ln) => this.geometry.getInsertionAnchorY(ln),
      getLineIndentPosByWidth: (ln, w) => this.geometry.getLineIndentPosByWidth(ln, w),
      getBlockRect: (s, e) => this.geometry.getBlockRect(s, e),
      ...hooks
    };
  }
  createBlockMoverDeps() {
    return {
      parseLineWithQuote: (line) => this.textMutation.parseLineWithQuote(line),
      resolveDropRuleAtInsertion: (src, ln, opts) => this.containerPolicy.resolveDropRuleAtInsertion(src, ln, opts),
      getListContext: (doc, ln) => this.textMutation.getListContext(doc, ln),
      getIndentUnitWidth: (sample) => this.textMutation.getIndentUnitWidth(sample),
      buildInsertText: (doc, src, ln, content, listIntent) => this.textMutation.buildInsertText(doc, src, ln, content, listIntent)
    };
  }
  createSharedDropPolicyDeps() {
    return {
      parseLineWithQuote: (line) => this.textMutation.parseLineWithQuote(line),
      getAdjustedTargetLocation: (ln, opts) => this.geometry.getAdjustedTargetLocation(ln, opts),
      resolveDropRuleAtInsertion: (src, ln, opts) => this.containerPolicy.resolveDropRuleAtInsertion(src, ln, opts),
      getListContext: (doc, ln) => this.textMutation.getListContext(doc, ln),
      getIndentUnitWidth: (sample) => this.textMutation.getIndentUnitWidth(sample)
    };
  }
};

// src/runtime/drag-lifecycle-emitter.ts
var DragLifecycleEmitter = class {
  constructor(sink) {
    this.sink = sink;
    this.lastSignature = null;
  }
  emit(event) {
    const payload = normalizeEvent(event);
    const signature = buildSignature(payload);
    if (signature === this.lastSignature)
      return;
    this.lastSignature = signature;
    this.sink(payload);
  }
  reset() {
    this.lastSignature = null;
  }
};
function normalizeEvent(event) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  switch (event.type) {
    case "drag_idle":
      return {
        type: "drag_idle",
        phase: "idle",
        sourceBlock: null,
        targetLine: null,
        listIntent: null,
        rejectReason: null,
        pointerType: null
      };
    case "drag_press_pending":
      return {
        type: "drag_press_pending",
        phase: "press_pending",
        sourceBlock: event.sourceBlock,
        targetLine: null,
        listIntent: null,
        rejectReason: null,
        pointerType: (_a = event.pointerType) != null ? _a : null,
        pressReady: event.pressReady === true
      };
    case "drag_started":
      return {
        type: "drag_started",
        phase: "drag_active",
        sourceBlock: event.sourceBlock,
        targetLine: null,
        listIntent: null,
        rejectReason: null,
        pointerType: (_b = event.pointerType) != null ? _b : null
      };
    case "drag_target_changed":
      return {
        type: "drag_target_changed",
        phase: "drag_active",
        sourceBlock: event.sourceBlock,
        targetLine: typeof event.targetLine === "number" ? event.targetLine : null,
        listIntent: (_c = event.listIntent) != null ? _c : null,
        rejectReason: (_d = event.rejectReason) != null ? _d : null,
        pointerType: (_e = event.pointerType) != null ? _e : null
      };
    case "drag_drop_commit":
      return {
        type: "drag_drop_commit",
        phase: "drop_commit",
        sourceBlock: event.sourceBlock,
        targetLine: typeof event.targetLine === "number" ? event.targetLine : null,
        listIntent: (_f = event.listIntent) != null ? _f : null,
        rejectReason: null,
        pointerType: (_g = event.pointerType) != null ? _g : null
      };
    case "drag_cancelled":
      return {
        type: "drag_cancelled",
        phase: "cancelled",
        sourceBlock: (_h = event.sourceBlock) != null ? _h : null,
        targetLine: typeof event.targetLine === "number" ? event.targetLine : null,
        listIntent: (_i = event.listIntent) != null ? _i : null,
        rejectReason: event.rejectReason,
        pointerType: (_j = event.pointerType) != null ? _j : null
      };
  }
}
function buildSignature(event) {
  var _a, _b, _c, _d;
  return JSON.stringify({
    type: event.type,
    phase: event.phase,
    sourceStart: (_b = (_a = event.sourceBlock) == null ? void 0 : _a.startLine) != null ? _b : null,
    sourceEnd: (_d = (_c = event.sourceBlock) == null ? void 0 : _c.endLine) != null ? _d : null,
    targetLine: event.targetLine,
    listIntent: event.listIntent,
    rejectReason: event.rejectReason,
    pointerType: event.pointerType,
    pressReady: event.type === "drag_press_pending" && event.pressReady === true
  });
}

// src/shared/utils/drop-protocol.ts
function buildListIntent(intent) {
  if (typeof (intent == null ? void 0 : intent.contextLineNumber) !== "number" && typeof (intent == null ? void 0 : intent.indentDelta) !== "number" && typeof (intent == null ? void 0 : intent.targetIndentWidth) !== "number") {
    return null;
  }
  return {
    contextLineNumber: intent == null ? void 0 : intent.contextLineNumber,
    indentDelta: intent == null ? void 0 : intent.indentDelta,
    targetIndentWidth: intent == null ? void 0 : intent.targetIndentWidth
  };
}

// src/drag/gesture/interaction-orchestrator.ts
var DragInteractionOrchestrator = class {
  constructor(deps) {
    this.view = deps.view;
    this.services = deps.services;
    this.blockMover = deps.blockMover;
    this.dropPlanner = deps.dropPlanner;
    this.handleVisibility = deps.handleVisibility;
    this.dragPerfManager = deps.dragPerfManager;
    this.lifecycleEmitter = deps.lifecycleEmitter;
    this.getSemanticRefreshScheduler = deps.getSemanticRefreshScheduler;
    this.refreshDecorationsAndEmbeds = deps.refreshDecorationsAndEmbeds;
    this.resolveEditorDocumentKey = deps.resolveEditorDocumentKey;
    this.allowCrossDocumentDrop = deps.allowCrossDocumentDrop;
  }
  performDropAtPoint(sourceBlock, clientX, clientY, pointerType) {
    var _a, _b, _c, _d, _e;
    this.ensureDragPerfSession();
    const view = this.view;
    const sourceView = getActiveDragSourceView();
    const sourceScope = sourceView && sourceView !== view ? "cross_editor" : "same_editor";
    const sourceDocumentRelation = this.resolveDragDocumentRelation(sourceView);
    if (sourceScope === "cross_editor" && sourceDocumentRelation === "different_document" && ((_a = this.allowCrossDocumentDrop) == null ? void 0 : _a.call(this)) !== true) {
      this.emitDragLifecycle(buildCancelledLifecycleEvent({
        sourceBlock,
        rejectReason: "cross_document_disabled",
        pointerType
      }));
      return;
    }
    const validation = this.dropPlanner.resolveValidatedDropTarget({
      clientX,
      clientY,
      dragSource: sourceBlock,
      pointerType,
      sourceScope
    });
    const listIntent = buildListIntent((_b = validation.plan) == null ? void 0 : _b.listIntent);
    if (!validation.allowed || !validation.plan) {
      this.emitDragLifecycle(buildCancelledLifecycleEvent({
        sourceBlock,
        targetLine: (_d = (_c = validation.plan) == null ? void 0 : _c.targetLineNumber) != null ? _d : null,
        listIntent,
        rejectReason: (_e = validation.reason) != null ? _e : "no_target",
        pointerType
      }));
      return;
    }
    const targetLineNumber = validation.plan.targetLineNumber;
    this.blockMover.moveBlock({
      sourceBlock,
      dropPlan: validation.plan,
      sourceView: sourceScope === "cross_editor" && sourceView ? sourceView : void 0,
      sourceDocumentRelation
    });
    this.emitDragLifecycle(buildDropCommitLifecycleEvent({
      sourceBlock,
      targetLine: targetLineNumber,
      listIntent,
      pointerType
    }));
  }
  resolveInteractionBlockInfo(params) {
    var _a, _b, _c;
    const allowRefreshRetry = params.allowRefreshRetry !== false;
    const resolveOnce = () => {
      var _a2, _b2, _c2, _d;
      if (params.handle) {
        let fromHandle = null;
        try {
          fromHandle = this.services.dragSource.getBlockInfoForHandle(params.handle);
        } catch (e) {
          fromHandle = null;
        }
        if (fromHandle) {
          this.syncHandleBlockAttributes(params.handle, fromHandle);
          return fromHandle;
        }
      }
      if (Number.isFinite(params.clientX) && Number.isFinite(params.clientY)) {
        let fromPoint = null;
        try {
          fromPoint = this.services.dragSource.getDraggableBlockAtPoint(params.clientX, params.clientY);
        } catch (e) {
          fromPoint = null;
        }
        if (fromPoint) {
          this.syncHandleBlockAttributes((_a2 = params.handle) != null ? _a2 : null, fromPoint);
          return fromPoint;
        }
      }
      const fromFallback = (_c2 = (_b2 = params.fallback) == null ? void 0 : _b2.call(params)) != null ? _c2 : null;
      if (fromFallback) {
        this.syncHandleBlockAttributes((_d = params.handle) != null ? _d : null, fromFallback);
      }
      return fromFallback;
    };
    const first = resolveOnce();
    if (first || !allowRefreshRetry)
      return first;
    this.refreshDecorationsAndEmbeds();
    if (Number.isFinite(params.clientX) && Number.isFinite(params.clientY)) {
      try {
        const fromPoint = this.services.dragSource.getDraggableBlockAtPoint(params.clientX, params.clientY);
        if (fromPoint) {
          this.syncHandleBlockAttributes((_a = params.handle) != null ? _a : null, fromPoint);
          return fromPoint;
        }
      } catch (e) {
      }
    }
    return (_c = (_b = params.fallback) == null ? void 0 : _b.call(params)) != null ? _c : null;
  }
  ensureDragPerfSession() {
    this.getSemanticRefreshScheduler().ensureSemanticReadyForInteraction();
    this.dragPerfManager.ensure();
  }
  flushDragPerfSession(reason) {
    this.dragPerfManager.flush(reason);
  }
  emitDragLifecycle(event) {
    this.lifecycleEmitter.emit(event);
  }
  syncHandleBlockAttributes(handle, blockInfo) {
    if (!handle || !handle.isConnected)
      return;
    handle.setAttribute("data-block-start", String(blockInfo.startLine));
    handle.setAttribute("data-block-end", String(blockInfo.endLine));
  }
  resolveDragDocumentRelation(sourceView) {
    if (!sourceView || sourceView === this.view) {
      return "same_document";
    }
    const resolveDocumentKey = this.resolveEditorDocumentKey;
    if (!resolveDocumentKey) {
      return "different_document";
    }
    const sourceDocumentKey = resolveDocumentKey(sourceView);
    const targetDocumentKey = resolveDocumentKey(this.view);
    if (!sourceDocumentKey || !targetDocumentKey) {
      return "different_document";
    }
    return sourceDocumentKey === targetDocumentKey ? "same_document" : "different_document";
  }
};

// src/plugin/settings.ts
var import_obsidian2 = require("obsidian");

// src/plugin/i18n/index.ts
var import_obsidian = require("obsidian");

// src/plugin/i18n/en.ts
var en = {
  headingAppearance: "Appearance",
  headingBehavior: "Behavior",
  handleColor: "Handle color",
  handleColorDesc: "Follow theme accent or pick a custom color",
  optionTheme: "Theme",
  optionCustom: "Custom",
  handleVisibility: "Handle visibility",
  handleVisibilityDesc: "Control how drag handles are displayed",
  optionHover: "Hover",
  optionAlways: "Always",
  optionHidden: "Hidden",
  dragSourceVisualStyle: "Drag source visual style",
  dragSourceVisualStyleDesc: "Shared highlight style",
  optionDragSourceVisualOutline: "Outline only",
  optionDragSourceVisualSubtle: "Subtle highlight",
  optionDragSourceVisualFilled: "Filled highlight",
  enableDragSourceHighlight: "Drag source highlight",
  enableDragSourceHighlightDesc: "Highlight the block being dragged",
  enableListDropHighlight: "List drop highlight",
  enableListDropHighlightDesc: "Highlight list drop target area",
  handleIcon: "Handle icon",
  handleIconDesc: "Choose the icon style for drag handles",
  iconDot: "\u25CF dot",
  iconGripDots: "\u283F grip dots",
  iconGripLines: "\u2630 grip lines",
  iconSquare: "\u25A0 square",
  handleSize: "Handle size",
  handleSizeDesc: "Adjust the size of drag handles (px)",
  handleOffset: "Handle horizontal offset",
  handleOffsetDesc: "Negative = left, positive = right",
  handleGutterPosition: "Handle gutter side",
  handleGutterPositionDesc: "Show the handle gutter on the left or right side of the editor",
  optionLeft: "Left",
  optionRight: "Right",
  indicatorColor: "Indicator color",
  indicatorColorDesc: "Follow theme accent or pick a custom color",
  multiLineSelection: "Multi-line selection",
  multiLineSelectionDesc: "Disable to keep single-block drag only",
  multiLineSelectionLongPressMs: "Multi-line selection long-press duration",
  multiLineSelectionLongPressMsDesc: "Enter milliseconds (300-2000). On mobile, hold for this duration before entering multi-block selection mode",
  mobileTextLongPressDrag: "Mobile text long-press drag",
  mobileTextLongPressDragDesc: "On mobile, long-press a text line or rendered block content to drag the current block directly without using the left handle",
  enableCrossFileDrag: "Cross-file drag",
  enableCrossFileDragDesc: "Allow dragging blocks into open editors, internal links, and file explorer notes"
};

// src/plugin/i18n/zh-cn.ts
var zhCn = {
  // Headings
  headingAppearance: "\u6837\u5F0F",
  headingBehavior: "\u529F\u80FD",
  // Handle color
  handleColor: "\u624B\u67C4\u989C\u8272",
  handleColorDesc: "\u8DDF\u968F\u4E3B\u9898\u5F3A\u8C03\u8272\u6216\u81EA\u5B9A\u4E49\u989C\u8272",
  optionTheme: "\u8DDF\u968F\u4E3B\u9898\u8272",
  optionCustom: "\u81EA\u5B9A\u4E49",
  // Handle visibility
  handleVisibility: "\u624B\u67C4\u663E\u793A\u6A21\u5F0F",
  handleVisibilityDesc: "\u63A7\u5236\u62D6\u62FD\u624B\u67C4\u7684\u663E\u793A\u65B9\u5F0F",
  optionHover: "\u60AC\u505C\u663E\u793A",
  optionAlways: "\u59CB\u7EC8\u663E\u793A",
  optionHidden: "\u9690\u85CF",
  dragSourceVisualStyle: "\u62D6\u62FD\u6E90\u89C6\u89C9\u6837\u5F0F",
  dragSourceVisualStyleDesc: "\u7EDF\u4E00\u9AD8\u4EAE\u6837\u5F0F",
  optionDragSourceVisualOutline: "\u7EAF\u8FB9\u6846",
  optionDragSourceVisualSubtle: "\u7B80\u7EA6\u9AD8\u4EAE",
  optionDragSourceVisualFilled: "\u80CC\u666F\u589E\u5F3A",
  enableDragSourceHighlight: "\u62D6\u62FD\u6E90\u9AD8\u4EAE",
  enableDragSourceHighlightDesc: "\u9AD8\u4EAE\u88AB\u62D6\u52A8\u7684\u6E90\u5757",
  enableListDropHighlight: "\u5217\u8868\u843D\u70B9\u9AD8\u4EAE",
  enableListDropHighlightDesc: "\u9AD8\u4EAE\u5217\u8868\u5185\u53EF\u653E\u7F6E\u533A\u57DF",
  // Handle icon
  handleIcon: "\u624B\u67C4\u56FE\u6807",
  handleIconDesc: "\u9009\u62E9\u62D6\u62FD\u624B\u67C4\u7684\u56FE\u6807\u6837\u5F0F",
  iconDot: "\u25CF \u5706\u70B9",
  iconGripDots: "\u283F \u516D\u70B9\u6293\u624B",
  iconGripLines: "\u2630 \u4E09\u6A2A\u7EBF",
  iconSquare: "\u25A0 \u65B9\u5757",
  // Handle size
  handleSize: "\u624B\u67C4\u5927\u5C0F",
  handleSizeDesc: "\u8C03\u6574\u62D6\u62FD\u624B\u67C4\u7684\u5927\u5C0F\uFF08\u50CF\u7D20\uFF09",
  // Handle offset
  handleOffset: "\u624B\u67C4\u6A2A\u5411\u4F4D\u7F6E",
  handleOffsetDesc: "\u5411\u5DE6\u4E3A\u8D1F\u503C\uFF0C\u5411\u53F3\u4E3A\u6B63\u503C",
  handleGutterPosition: "\u624B\u67C4\u6240\u5728\u4FA7",
  handleGutterPositionDesc: "\u63A7\u5236\u624B\u67C4 gutter \u663E\u793A\u5728\u7F16\u8F91\u5668\u5DE6\u4FA7\u8FD8\u662F\u53F3\u4FA7",
  optionLeft: "\u5DE6\u4FA7",
  optionRight: "\u53F3\u4FA7",
  // Indicator color
  indicatorColor: "\u6307\u793A\u5668\u989C\u8272",
  indicatorColorDesc: "\u8DDF\u968F\u4E3B\u9898\u5F3A\u8C03\u8272\u6216\u81EA\u5B9A\u4E49\u989C\u8272",
  // Multi-line selection
  multiLineSelection: "\u591A\u884C\u9009\u53D6",
  multiLineSelectionDesc: "\u5173\u95ED\u540E\u4EC5\u4FDD\u7559\u5355\u5757\u62D6\u62FD\uFF0C\u4E0D\u8FDB\u5165\u591A\u884C\u9009\u53D6\u6D41\u7A0B",
  multiLineSelectionLongPressMs: "\u591A\u9009\u6A21\u5F0F\u957F\u6309\u65F6\u957F",
  multiLineSelectionLongPressMsDesc: "\u8F93\u5165\u6BEB\u79D2\u6570\uFF08300-2000\uFF09\uFF0C\u79FB\u52A8\u7AEF\u957F\u6309\u8FBE\u5230\u8BE5\u65F6\u957F\u540E\u8FDB\u5165\u591A\u6587\u672C\u5757\u9009\u62E9\u6A21\u5F0F",
  mobileTextLongPressDrag: "\u79FB\u52A8\u7AEF\u6587\u672C\u957F\u6309\u62D6\u62FD",
  mobileTextLongPressDragDesc: "\u79FB\u52A8\u7AEF\u5728\u6587\u672C\u6574\u884C\u6216\u5757\u5185\u5BB9\u533A\u57DF\u957F\u6309\u53EF\u76F4\u63A5\u62D6\u62FD\u5F53\u524D\u5757\uFF0C\u65E0\u9700\u5DE6\u4FA7\u624B\u67C4",
  enableCrossFileDrag: "\u8DE8\u6587\u4EF6\u62D6\u62FD",
  enableCrossFileDragDesc: "\u5141\u8BB8\u5C06\u5757\u62D6\u62FD\u5230\u5DF2\u6253\u5F00\u7F16\u8F91\u5668\u3001\u5185\u90E8\u94FE\u63A5\u6216\u6587\u4EF6\u5217\u8868\u7B14\u8BB0\u4E2D"
};

// src/plugin/i18n/index.ts
function t() {
  const locale = import_obsidian.moment.locale();
  return locale.startsWith("zh") ? zhCn : en;
}

// src/plugin/settings.ts
var DEFAULT_MULTI_LINE_SELECTION_LONG_PRESS_MS = 900;
var MIN_MULTI_LINE_SELECTION_LONG_PRESS_MS = 300;
var MAX_MULTI_LINE_SELECTION_LONG_PRESS_MS = 2e3;
function normalizeMultiLineSelectionLongPressMs(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_MULTI_LINE_SELECTION_LONG_PRESS_MS;
  }
  return Math.max(
    MIN_MULTI_LINE_SELECTION_LONG_PRESS_MS,
    Math.min(MAX_MULTI_LINE_SELECTION_LONG_PRESS_MS, Math.round(value))
  );
}
var DEFAULT_SETTINGS = {
  handleColorMode: "theme",
  handleColor: "#8a8a8a",
  handleVisibility: "hover",
  handleIcon: "grip-dots",
  handleSize: DEFAULT_HANDLE_SIZE_PX,
  indicatorColorMode: "theme",
  indicatorColor: "#7a7a7a",
  enableCrossFileDrag: false,
  enableMultiLineSelection: true,
  multiLineSelectionLongPressMs: DEFAULT_MULTI_LINE_SELECTION_LONG_PRESS_MS,
  enableMobileTextLongPressDrag: true,
  enableDragSourceHighlight: true,
  enableListDropHighlight: true,
  dragSourceVisualStyle: "subtle",
  handleHorizontalOffsetPx: -8,
  handleGutterPosition: "left"
};
function normalizeHandleGutterPosition(value) {
  return value === "right" ? "right" : "left";
}
function normalizeDragSourceVisualStyle(value) {
  if (value === "outline" || value === "subtle" || value === "filled") {
    return value;
  }
  if (value === "none") {
    return "outline";
  }
  return "subtle";
}
var DragNDropSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    const i = t();
    new import_obsidian2.Setting(containerEl).setName(i.headingAppearance).setHeading();
    const colorSetting = new import_obsidian2.Setting(containerEl).setName(i.handleColor).setDesc(i.handleColorDesc);
    colorSetting.addDropdown((dropdown) => dropdown.addOption("theme", i.optionTheme).addOption("custom", i.optionCustom).setValue(this.plugin.settings.handleColorMode).onChange(async (value) => {
      this.plugin.settings.handleColorMode = value;
      await this.plugin.saveSettings();
    }));
    colorSetting.addColorPicker((picker) => picker.setValue(this.plugin.settings.handleColor).onChange(async (value) => {
      this.plugin.settings.handleColor = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.handleVisibility).setDesc(i.handleVisibilityDesc).addDropdown((dropdown) => dropdown.addOption("hover", i.optionHover).addOption("always", i.optionAlways).addOption("hidden", i.optionHidden).setValue(this.plugin.settings.handleVisibility).onChange(async (value) => {
      this.plugin.settings.handleVisibility = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.dragSourceVisualStyle).setDesc(i.dragSourceVisualStyleDesc).addDropdown((dropdown) => dropdown.addOption("outline", i.optionDragSourceVisualOutline).addOption("subtle", i.optionDragSourceVisualSubtle).addOption("filled", i.optionDragSourceVisualFilled).setValue(this.plugin.settings.dragSourceVisualStyle).onChange(async (value) => {
      this.plugin.settings.dragSourceVisualStyle = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.enableDragSourceHighlight).setDesc(i.enableDragSourceHighlightDesc).addToggle((toggle) => toggle.setValue(this.plugin.settings.enableDragSourceHighlight).onChange(async (value) => {
      this.plugin.settings.enableDragSourceHighlight = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.enableListDropHighlight).setDesc(i.enableListDropHighlightDesc).addToggle((toggle) => toggle.setValue(this.plugin.settings.enableListDropHighlight).onChange(async (value) => {
      this.plugin.settings.enableListDropHighlight = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.handleIcon).setDesc(i.handleIconDesc).addDropdown((dropdown) => dropdown.addOption("dot", i.iconDot).addOption("grip-dots", i.iconGripDots).addOption("grip-lines", i.iconGripLines).addOption("square", i.iconSquare).setValue(this.plugin.settings.handleIcon).onChange(async (value) => {
      this.plugin.settings.handleIcon = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.handleSize).setDesc(i.handleSizeDesc).addSlider((slider) => slider.setLimits(MIN_HANDLE_SIZE_PX, MAX_HANDLE_SIZE_PX, 2).setDynamicTooltip().setValue(this.plugin.settings.handleSize).onChange(async (value) => {
      this.plugin.settings.handleSize = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.handleOffset).setDesc(i.handleOffsetDesc).addSlider((slider) => slider.setLimits(-80, 80, 1).setDynamicTooltip().setValue(this.plugin.settings.handleHorizontalOffsetPx).onChange(async (value) => {
      this.plugin.settings.handleHorizontalOffsetPx = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.handleGutterPosition).setDesc(i.handleGutterPositionDesc).addDropdown((dropdown) => dropdown.addOption("left", i.optionLeft).addOption("right", i.optionRight).setValue(this.plugin.settings.handleGutterPosition).onChange(async (value) => {
      this.plugin.settings.handleGutterPosition = value;
      await this.plugin.saveSettings();
    }));
    const indicatorSetting = new import_obsidian2.Setting(containerEl).setName(i.indicatorColor).setDesc(i.indicatorColorDesc);
    indicatorSetting.addDropdown((dropdown) => dropdown.addOption("theme", i.optionTheme).addOption("custom", i.optionCustom).setValue(this.plugin.settings.indicatorColorMode).onChange(async (value) => {
      this.plugin.settings.indicatorColorMode = value;
      await this.plugin.saveSettings();
    }));
    indicatorSetting.addColorPicker((picker) => picker.setValue(this.plugin.settings.indicatorColor).onChange(async (value) => {
      this.plugin.settings.indicatorColor = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.headingBehavior).setHeading();
    new import_obsidian2.Setting(containerEl).setName(i.multiLineSelection).setDesc(i.multiLineSelectionDesc).addToggle((toggle) => toggle.setValue(this.plugin.settings.enableMultiLineSelection).onChange(async (value) => {
      this.plugin.settings.enableMultiLineSelection = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.multiLineSelectionLongPressMs).setDesc(i.multiLineSelectionLongPressMsDesc).addText((text) => {
      const commit = async () => {
        const normalized = normalizeMultiLineSelectionLongPressMs(Number(text.inputEl.value));
        const normalizedValue = String(normalized);
        if (text.inputEl.value !== normalizedValue) {
          text.setValue(normalizedValue);
        }
        if (this.plugin.settings.multiLineSelectionLongPressMs === normalized) {
          return;
        }
        this.plugin.settings.multiLineSelectionLongPressMs = normalized;
        await this.plugin.saveSettings();
      };
      text.inputEl.type = "number";
      text.inputEl.inputMode = "numeric";
      text.inputEl.min = String(MIN_MULTI_LINE_SELECTION_LONG_PRESS_MS);
      text.inputEl.max = String(MAX_MULTI_LINE_SELECTION_LONG_PRESS_MS);
      text.inputEl.step = "1";
      text.setPlaceholder(`${MIN_MULTI_LINE_SELECTION_LONG_PRESS_MS}-${MAX_MULTI_LINE_SELECTION_LONG_PRESS_MS}`);
      text.setValue(String(this.plugin.settings.multiLineSelectionLongPressMs));
      text.inputEl.addEventListener("blur", () => {
        void commit();
      });
      text.inputEl.addEventListener("keydown", (event) => {
        if (event.key !== "Enter")
          return;
        event.preventDefault();
        text.inputEl.blur();
      });
    });
    new import_obsidian2.Setting(containerEl).setName(i.mobileTextLongPressDrag).setDesc(i.mobileTextLongPressDragDesc).addToggle((toggle) => toggle.setValue(this.plugin.settings.enableMobileTextLongPressDrag).onChange(async (value) => {
      this.plugin.settings.enableMobileTextLongPressDrag = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian2.Setting(containerEl).setName(i.enableCrossFileDrag).setDesc(i.enableCrossFileDragDesc).addToggle((toggle) => toggle.setValue(this.plugin.settings.enableCrossFileDrag).onChange(async (value) => {
      this.plugin.settings.enableCrossFileDrag = value;
      await this.plugin.saveSettings();
    }));
  }
};

// src/platform/obsidian/editor-document-key.ts
function resolveEditorDocumentKey(app, editorView) {
  var _a;
  const markdownView = resolveMarkdownViewForEditor(app, editorView);
  const path = (_a = markdownView == null ? void 0 : markdownView.file) == null ? void 0 : _a.path;
  if (typeof path === "string" && path.length > 0)
    return path;
  return null;
}

// src/drag/move/block-fold-state.ts
function createBlockFoldStateManager(params) {
  const { app, parseLineWithQuote: parseLineWithQuote3 } = params;
  return {
    capture(view, sourceBlock) {
      var _a, _b, _c;
      if (!isBlockFoldStateSupported(sourceBlock))
        return null;
      if (((_c = (_b = (_a = sourceBlock.compositeSelection) == null ? void 0 : _a.ranges) == null ? void 0 : _b.length) != null ? _c : 0) > 1)
        return null;
      const startLineNumber = sourceBlock.startLine + 1;
      const endLineNumber = sourceBlock.endLine + 1;
      const collapsedRelativeLineOffsets = [];
      for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
        const lineText = view.state.doc.line(lineNumber).text;
        if (!isFoldableLineWithinBlock(sourceBlock, lineText, parseLineWithQuote3))
          continue;
        if (!isEditorLineCollapsed(view, lineNumber))
          continue;
        collapsedRelativeLineOffsets.push(lineNumber - startLineNumber);
      }
      if (collapsedRelativeLineOffsets.length === 0)
        return null;
      return { collapsedRelativeLineOffsets };
    },
    restore(view, targetStartLineNumber, foldState) {
      var _a;
      const collapsedRelativeLineOffsets = (_a = foldState == null ? void 0 : foldState.collapsedRelativeLineOffsets) != null ? _a : [];
      if (collapsedRelativeLineOffsets.length === 0)
        return;
      toggleLineFolds({
        app,
        view,
        targetLineNumbers: collapsedRelativeLineOffsets.map(
          (relativeOffset) => targetStartLineNumber + relativeOffset
        )
      });
    }
  };
}
function isBlockFoldStateSupported(sourceBlock) {
  return sourceBlock.type === "list-item" /* ListItem */ || sourceBlock.type === "heading" /* Heading */;
}
function isFoldableLineWithinBlock(sourceBlock, lineText, parseLineWithQuote3) {
  if (sourceBlock.type === "list-item" /* ListItem */) {
    return parseLineWithQuote3(lineText).isListItem;
  }
  if (sourceBlock.type === "heading" /* Heading */) {
    return getHeadingLevel(lineText) !== null;
  }
  return false;
}

// src/runtime/editor-dom-sync.ts
function ensureEditorRootClasses(view) {
  view.dom.classList.add(ROOT_EDITOR_CLASS);
  view.contentDOM.classList.add(MAIN_EDITOR_CONTENT_CLASS);
}
function clearEditorRootClasses(view) {
  view.dom.classList.remove(ROOT_EDITOR_CLASS);
  view.contentDOM.classList.remove(MAIN_EDITOR_CONTENT_CLASS);
}
function syncDragSourceStyleAttr(view, style) {
  view.dom.setAttribute(DND_DRAG_SOURCE_STYLE_ATTR, style);
}
function syncDragSourceHighlightAttr(view, enabled) {
  view.dom.setAttribute(DND_DRAG_SOURCE_HIGHLIGHT_ATTR, enabled ? "on" : "off");
}

// src/drag/drop/list-drop-planner.ts
var ListDropPlanner = class {
  constructor(view, deps) {
    this.view = view;
    this.deps = deps;
  }
  getListMarkerBounds(lineNumber, options) {
    var _a;
    const doc = this.view.state.doc;
    if (lineNumber < 1 || lineNumber > doc.lines)
      return null;
    const memo = options == null ? void 0 : options.memo;
    if (memo && memo.markerBoundsByLine.has(lineNumber)) {
      return (_a = memo.markerBoundsByLine.get(lineNumber)) != null ? _a : null;
    }
    const parsed = this.getParsedLineAtLineNumber(
      doc,
      lineNumber,
      memo,
      options == null ? void 0 : options.lineMap
    );
    if (!parsed || !parsed.isListItem) {
      if (memo)
        memo.markerBoundsByLine.set(lineNumber, null);
      return null;
    }
    const line = doc.line(lineNumber);
    const markerStartPos = line.from + parsed.quotePrefix.length + parsed.indentRaw.length;
    const contentStartPos = markerStartPos + parsed.marker.length;
    const markerStart = getCoordsAtPos(this.view, markerStartPos);
    const contentStart = getCoordsAtPos(this.view, contentStartPos);
    if (!markerStart || !contentStart) {
      if (memo)
        memo.markerBoundsByLine.set(lineNumber, null);
      return null;
    }
    const bounds = {
      markerStartX: markerStart.left,
      contentStartX: contentStart.left
    };
    if (memo)
      memo.markerBoundsByLine.set(lineNumber, bounds);
    return bounds;
  }
  computeListTarget(params) {
    const {
      targetLineNumber,
      lineNumber,
      forcedLineNumber,
      childIntentOnLine,
      dragSource,
      sourceScope = "same_editor",
      clientX,
      lineMap: providedLineMap
    } = params;
    if (!dragSource || dragSource.type !== "list-item" /* ListItem */)
      return {};
    const finalize = (result) => {
      return result;
    };
    const doc = this.view.state.doc;
    const lineMap = providedLineMap != null ? providedLineMap : getLineMap(this.view.state);
    const memo = {
      parsedLineByLine: /* @__PURE__ */ new Map(),
      markerBoundsByLine: /* @__PURE__ */ new Map(),
      listIndentByLine: /* @__PURE__ */ new Map()
    };
    const indentUnit = this.deps.getIndentUnitWidthForDoc(doc);
    const context = {
      doc,
      lineMap,
      memo,
      indentUnit
    };
    const prevNonEmptyLineNumber = this.deps.getPreviousNonEmptyLineNumber(doc, targetLineNumber - 1);
    let referenceLineNumber = prevNonEmptyLineNumber != null ? prevNonEmptyLineNumber : 0;
    if (!forcedLineNumber && childIntentOnLine) {
      referenceLineNumber = lineNumber;
    }
    if (referenceLineNumber < 1)
      return finalize({});
    const baseLineNumber = this.resolveReferenceListLineNumber(referenceLineNumber, lineMap);
    if (baseLineNumber === null)
      return finalize({});
    const isSelfTarget = sourceScope !== "cross_editor" && !!dragSource && dragSource.type === "list-item" /* ListItem */ && baseLineNumber === dragSource.startLine + 1;
    const allowChild = !isSelfTarget;
    const dropTarget = this.getListDropTarget(baseLineNumber, clientX, allowChild, context);
    if (!dropTarget)
      return finalize({});
    const listIntent = {
      contextLineNumber: dropTarget.lineNumber,
      indentDelta: dropTarget.mode === "child" ? 1 : 0,
      targetIndentWidth: dropTarget.indentWidth
    };
    let cappedIndentWidth = listIntent.targetIndentWidth;
    const prevIndent = this.getListIndentWidthAtLine(doc, baseLineNumber, lineMap, memo);
    if (typeof prevIndent === "number") {
      const maxAllowedIndent = prevIndent + indentUnit;
      if (cappedIndentWidth > maxAllowedIndent) {
        cappedIndentWidth = maxAllowedIndent;
      }
    }
    const nextLineNumber = targetLineNumber <= doc.lines ? targetLineNumber : null;
    if (nextLineNumber !== null) {
      const nextIndent = this.getListIndentWidthAtLine(doc, nextLineNumber, lineMap, memo);
      if (typeof nextIndent === "number") {
        const minAllowedIndent = Math.max(0, nextIndent - indentUnit);
        if (cappedIndentWidth < minAllowedIndent) {
          cappedIndentWidth = minAllowedIndent;
        }
      }
    }
    listIntent.targetIndentWidth = cappedIndentWidth;
    const highlightInfo = this.computeHighlightRectForList({
      targetLineNumber,
      listTargetIndentWidth: listIntent.targetIndentWidth,
      context
    });
    return finalize({
      listIntent,
      highlightRect: highlightInfo.highlightRect,
      lineRectSourceLineNumber: highlightInfo.lineRectSourceLineNumber
    });
  }
  computeHighlightRectForList(params) {
    var _a, _b, _c;
    const { targetLineNumber, listTargetIndentWidth, context } = params;
    if (listTargetIndentWidth <= 0)
      return {};
    const targetParentIndent = listTargetIndentWidth - context.indentUnit;
    const parentLineNumber = this.findParentLineNumberByIndent(
      context.doc,
      targetLineNumber - 1,
      targetParentIndent,
      context.lineMap,
      context.memo
    );
    if (parentLineNumber === null)
      return {};
    const parentMeta = getLineMetaAt(context.lineMap, parentLineNumber);
    if (!(parentMeta == null ? void 0 : parentMeta.isList))
      return {};
    const lineRectSourceLineNumber = parentLineNumber;
    const blockStartLineNumber = parentLineNumber;
    const mappedSubtreeEnd = context.lineMap.listSubtreeEndLine[parentLineNumber];
    const blockEndLineNumber = Math.max(
      blockStartLineNumber,
      mappedSubtreeEnd >= blockStartLineNumber ? mappedSubtreeEnd : blockStartLineNumber
    );
    const bounds = this.getListMarkerBounds(blockStartLineNumber, {
      memo: context.memo,
      lineMap: context.lineMap
    });
    const startLineObj = context.doc.line(blockStartLineNumber);
    const endLineObj = context.doc.line(blockEndLineNumber);
    const startCoords = getCoordsAtPos(this.view, startLineObj.from);
    const endCoords = getCoordsAtPos(this.view, endLineObj.to);
    if (bounds && startCoords && endCoords) {
      const lineCount = blockEndLineNumber - blockStartLineNumber + 1;
      (_b = (_a = this.deps).incrementPerfCounter) == null ? void 0 : _b.call(_a, "highlight_scan_lines", lineCount);
      const left = bounds.markerStartX;
      let maxRight = left;
      for (let i = blockStartLineNumber; i <= blockEndLineNumber; i++) {
        const lineObj = context.doc.line(i);
        const lineEndCoords = getCoordsAtPos(this.view, lineObj.to);
        if (!lineEndCoords)
          continue;
        const right = (_c = lineEndCoords.right) != null ? _c : lineEndCoords.left;
        if (right > maxRight) {
          maxRight = right;
        }
      }
      const width = Math.max(8, maxRight - left);
      return {
        lineRectSourceLineNumber,
        highlightRect: {
          top: startCoords.top,
          left,
          width,
          height: Math.max(4, endCoords.bottom - startCoords.top)
        }
      };
    }
    return { lineRectSourceLineNumber };
  }
  getListDropTarget(lineNumber, clientX, allowChild, context) {
    const { doc, lineMap, memo, indentUnit } = context;
    if (lineNumber < 1 || lineNumber > doc.lines)
      return null;
    const bounds = this.getListMarkerBounds(lineNumber, { memo, lineMap });
    if (!bounds)
      return null;
    const slots = [];
    const baseIndent = this.getListIndentWidthAtLine(doc, lineNumber, lineMap, memo);
    const maxIndent = typeof baseIndent === "number" ? baseIndent + indentUnit : void 0;
    const columnPixelWidth = this.view.defaultCharacterWidth || 7;
    if (typeof baseIndent === "number") {
      slots.push({ x: bounds.markerStartX, lineNumber, indentWidth: baseIndent, mode: "same" });
    }
    if (allowChild && typeof baseIndent === "number") {
      const childIndent = baseIndent + indentUnit;
      if (maxIndent === void 0 || childIndent <= maxIndent) {
        const indentPixels = indentUnit * columnPixelWidth;
        const childSlotX = bounds.markerStartX + indentPixels;
        slots.push({ x: childSlotX, lineNumber, indentWidth: childIndent, mode: "child" });
      }
    }
    const ancestors = this.getListAncestorLineNumbers(doc, lineNumber, lineMap);
    for (const ancestorLine of ancestors) {
      if (ancestorLine === lineNumber)
        continue;
      const indentWidth = this.getListIndentWidthAtLine(doc, ancestorLine, lineMap, memo);
      if (typeof indentWidth !== "number" || typeof baseIndent !== "number")
        continue;
      const indentDeltaColumns = Math.max(0, baseIndent - indentWidth);
      const projectedX = bounds.markerStartX - indentDeltaColumns * columnPixelWidth;
      slots.push({
        x: projectedX,
        lineNumber: ancestorLine,
        indentWidth,
        mode: "same"
      });
    }
    if (slots.length === 0)
      return null;
    let best = slots[0];
    let bestDist = Math.abs(clientX - best.x);
    for (let i = 1; i < slots.length; i++) {
      const dist = Math.abs(clientX - slots[i].x);
      if (dist < bestDist) {
        best = slots[i];
        bestDist = dist;
      }
    }
    return { lineNumber: best.lineNumber, indentWidth: best.indentWidth, mode: best.mode };
  }
  resolveReferenceListLineNumber(lineNumber, lineMap) {
    const nearestListLine = getNearestListLineAtOrBefore(lineMap, lineNumber);
    if (nearestListLine === null)
      return null;
    let cursor = nearestListLine;
    while (cursor > 0) {
      const subtreeEnd = lineMap.listSubtreeEndLine[cursor];
      if (subtreeEnd >= lineNumber) {
        return cursor;
      }
      cursor = lineMap.listParentLine[cursor];
    }
    return null;
  }
  getParsedLineAtLineNumber(doc, lineNumber, memo, lineMap) {
    var _a;
    if (lineNumber < 1 || lineNumber > doc.lines)
      return null;
    if (memo == null ? void 0 : memo.parsedLineByLine.has(lineNumber)) {
      return (_a = memo.parsedLineByLine.get(lineNumber)) != null ? _a : null;
    }
    const lineMeta = lineMap ? getLineMetaAt(lineMap, lineNumber) : null;
    if (lineMeta && !lineMeta.isList) {
      return null;
    }
    const parsed = this.deps.parseLineWithQuote(doc.line(lineNumber).text);
    if (memo)
      memo.parsedLineByLine.set(lineNumber, parsed);
    return parsed;
  }
  getListIndentWidthAtLine(doc, lineNumber, lineMap, memo) {
    if (lineNumber < 1 || lineNumber > doc.lines)
      return void 0;
    if (memo == null ? void 0 : memo.listIndentByLine.has(lineNumber)) {
      return memo.listIndentByLine.get(lineNumber);
    }
    let indent;
    const lineMeta = lineMap ? getLineMetaAt(lineMap, lineNumber) : null;
    if (lineMeta) {
      indent = lineMeta.isList ? lineMeta.indentWidth : void 0;
    } else {
      const parsed = this.deps.parseLineWithQuote(doc.line(lineNumber).text);
      indent = parsed.isListItem ? parsed.indentWidth : void 0;
    }
    if (memo)
      memo.listIndentByLine.set(lineNumber, indent);
    return indent;
  }
  getListAncestorLineNumbers(doc, lineNumber, lineMap) {
    var _a, _b;
    const result = [];
    if (lineMap) {
      let steps = 0;
      let cursor = this.resolveReferenceListLineNumber(
        Math.max(1, Math.min(lineNumber, doc.lines)),
        lineMap
      );
      while (cursor !== null && cursor > 0) {
        result.push(cursor);
        steps += 1;
        const parent = lineMap.listParentLine[cursor];
        cursor = parent > 0 ? parent : null;
      }
      if (steps > 0) {
        (_b = (_a = this.deps).incrementPerfCounter) == null ? void 0 : _b.call(_a, "list_ancestor_scan_steps", steps);
      }
      return result;
    }
    let currentIndent = null;
    for (let i = lineNumber; i >= 1; i--) {
      const text = doc.line(i).text;
      if (text.trim().length === 0)
        continue;
      const parsed = this.deps.parseLineWithQuote(text);
      if (!parsed.isListItem) {
        if (currentIndent !== null)
          break;
        continue;
      }
      if (currentIndent === null) {
        currentIndent = parsed.indentWidth;
        result.push(i);
        continue;
      }
      if (parsed.indentWidth < currentIndent) {
        currentIndent = parsed.indentWidth;
        result.push(i);
      }
    }
    return result;
  }
  findParentLineNumberByIndent(doc, startLineNumber, targetIndent, lineMap, memo) {
    var _a, _b, _c, _d;
    if (lineMap) {
      let steps = 0;
      let cursor = this.resolveReferenceListLineNumber(
        Math.max(1, Math.min(startLineNumber, doc.lines)),
        lineMap
      );
      while (cursor !== null && cursor > 0) {
        steps += 1;
        const indent = this.getListIndentWidthAtLine(doc, cursor, lineMap, memo);
        if (typeof indent === "number" && indent === targetIndent) {
          (_b = (_a = this.deps).incrementPerfCounter) == null ? void 0 : _b.call(_a, "list_parent_scan_steps", steps);
          return cursor;
        }
        if (typeof indent === "number" && indent < targetIndent) {
          break;
        }
        const parent = lineMap.listParentLine[cursor];
        cursor = parent > 0 ? parent : null;
      }
      if (steps > 0) {
        (_d = (_c = this.deps).incrementPerfCounter) == null ? void 0 : _d.call(_c, "list_parent_scan_steps", steps);
      }
      return null;
    }
    for (let i = startLineNumber; i >= 1; i--) {
      const text = doc.line(i).text;
      if (text.trim().length === 0)
        continue;
      const parsed = this.deps.parseLineWithQuote(text);
      if (!parsed.isListItem)
        continue;
      if (parsed.indentWidth === targetIndent)
        return i;
    }
    return null;
  }
};

// src/runtime/view-runtime.ts
function createDropPlannerDeps(params) {
  const sharedDeps = params.services.createDropPlannerDeps({
    recordPerfDuration: (key, durationMs) => {
      params.dragPerfManager.recordDuration(key, durationMs);
    },
    incrementPerfCounter: (key, delta = 1) => {
      params.dragPerfManager.incrementCounter(key, delta);
    }
  });
  return {
    ...sharedDeps,
    listDropPlanner: new ListDropPlanner(params.view, {
      parseLineWithQuote: sharedDeps.parseLineWithQuote,
      getPreviousNonEmptyLineNumber,
      getIndentUnitWidthForDoc: sharedDeps.getIndentUnitWidthForDoc,
      getBlockRect: sharedDeps.getBlockRect,
      incrementPerfCounter: sharedDeps.incrementPerfCounter
    })
  };
}

// src/runtime/editor-update.ts
function applyViewUpdate(update, deps) {
  if (update.viewportChanged) {
    deps.refreshDecorationsAndEmbeds();
    deps.dragEventHandler.refreshSelectionVisual();
    deps.handleVisibility.refreshGrabVisualState();
    const activeHandle2 = deps.handleVisibility.getActiveHandle();
    if (activeHandle2 && !activeHandle2.isConnected) {
      deps.handleVisibility.setActiveVisibleHandle(null);
      deps.reResolveActiveHandle();
    }
    return;
  }
  if (update.docChanged) {
    deps.semanticRefreshScheduler.markSemanticRefreshPending();
  } else if (update.geometryChanged) {
    deps.refreshDecorationsAndEmbeds();
  }
  if (update.docChanged || update.geometryChanged) {
    deps.dragEventHandler.refreshSelectionVisual();
    deps.handleVisibility.refreshGrabVisualState();
  }
  const activeHandle = deps.handleVisibility.getActiveHandle();
  if (activeHandle && !activeHandle.isConnected) {
    deps.handleVisibility.setActiveVisibleHandle(null);
    deps.reResolveActiveHandle();
  }
}

// src/runtime/global-pointermove-router.ts
var clients = /* @__PURE__ */ new Set();
var clientsByRoot = /* @__PURE__ */ new Map();
var activeClient = null;
var isListening = false;
function containsPoint(view, clientX, clientY) {
  const rect = view.dom.getBoundingClientRect();
  return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
}
function resolveClientFromTarget(target) {
  if (!(target instanceof Node))
    return null;
  let current = target;
  while (current) {
    if (current instanceof HTMLElement) {
      const client = clientsByRoot.get(current);
      if (client)
        return client;
    }
    current = current.parentNode;
  }
  return null;
}
function resolveClientFromPoint(clientX, clientY) {
  for (const client of clients) {
    if (containsPoint(client.view, clientX, clientY)) {
      return client;
    }
  }
  return null;
}
function resolveClient(event) {
  var _a;
  return (_a = resolveClientFromTarget(event.target)) != null ? _a : resolveClientFromPoint(event.clientX, event.clientY);
}
function handleDocumentPointerMove(event) {
  const nextClient = resolveClient(event);
  if (activeClient && activeClient !== nextClient) {
    activeClient.clearPointerHover();
  }
  if (!nextClient) {
    activeClient = null;
    return;
  }
  activeClient = nextClient;
  nextClient.onPointerMove(event);
}
function ensureListening() {
  if (isListening)
    return;
  document.addEventListener("pointermove", handleDocumentPointerMove, { passive: true });
  isListening = true;
}
function stopListeningIfIdle() {
  if (!isListening || clients.size > 0)
    return;
  document.removeEventListener("pointermove", handleDocumentPointerMove);
  isListening = false;
}
function registerGlobalPointerMoveClient(client) {
  const root = client.view.dom;
  clients.add(client);
  clientsByRoot.set(root, client);
  ensureListening();
}
function unregisterGlobalPointerMoveClient(client) {
  clients.delete(client);
  clientsByRoot.delete(client.view.dom);
  if (activeClient === client) {
    client.clearPointerHover();
    activeClient = null;
  }
  stopListeningIfIdle();
}

// src/runtime/editor-lifecycle.ts
function startViewLifecycle(deps) {
  deps.dragEventHandler.attach();
  registerGlobalPointerMoveClient(deps.pointerMoveClient);
  window.addEventListener("dnd:settings-updated", deps.onSettingsUpdated);
  scheduleFenceScanWarmup(deps.view);
}
function destroyViewLifecycle(deps) {
  deps.semanticRefreshScheduler.destroy();
  unregisterGlobalPointerMoveClient(deps.pointerMoveClient);
  window.removeEventListener("dnd:settings-updated", deps.onSettingsUpdated);
  deps.dragEventHandler.destroy();
}
function scheduleFenceScanWarmup(view) {
  const warmupFenceScan = () => prewarmFenceScan(view.state.doc);
  const requestIdle = window.requestIdleCallback;
  if (typeof requestIdle === "function") {
    requestIdle(warmupFenceScan, { timeout: 1e3 });
  } else {
    window.setTimeout(warmupFenceScan, 100);
  }
}

// src/platform/codemirror/gutter.ts
function isVisible(el) {
  const style = getComputedStyle(el);
  return style.display !== "none" && style.visibility !== "hidden";
}
function getHandleGutter(view) {
  var _a;
  const candidates = Array.from(view.dom.querySelectorAll(`.${HANDLE_GUTTER_CLASS}`));
  return (_a = candidates.find((candidate) => candidate.closest(CODEMIRROR_EDITOR_SELECTOR) === view.dom && isVisible(candidate))) != null ? _a : null;
}
function placeHandleGutterForConfiguredSide(view, side) {
  const gutter2 = getHandleGutter(view);
  if (!gutter2)
    return;
  const parent = side === "right" ? view.contentDOM.parentElement : view.dom.querySelector(`${CODEMIRROR_GUTTERS_SELECTOR}.${CODEMIRROR_GUTTERS_BEFORE_CLASS}`);
  if (!parent || gutter2.parentElement === parent)
    return;
  parent.appendChild(gutter2);
}

// src/runtime/hover-pointer-snapshot.ts
function createHoverPointerSnapshot(view, clientX, clientY, gutterSide) {
  const contentRect = view.contentDOM.getBoundingClientRect();
  const withinVerticalBounds = clientY >= contentRect.top && clientY <= contentRect.bottom;
  const withinContent = withinVerticalBounds && clientX >= contentRect.left && clientX <= contentRect.right;
  const anchorX = gutterSide === "right" ? contentRect.right : contentRect.left;
  const withinHandleInteractionZone = withinVerticalBounds && clientX >= anchorX - HANDLE_INTERACTION_ZONE_PX && clientX <= anchorX + HANDLE_INTERACTION_ZONE_PX;
  return {
    clientX,
    clientY,
    contentRect,
    gutterSide,
    withinContent,
    withinHandleInteractionZone,
    withinHoverActivationZone: withinContent || withinHandleInteractionZone
  };
}

// src/runtime/pointer-drag-target-router.ts
var clients2 = /* @__PURE__ */ new Set();
var activeClient2 = null;
function resolveClientAtPoint(clientX, clientY) {
  for (const client of clients2) {
    if (client.containsPoint(clientX, clientY))
      return client;
  }
  return null;
}
function setActiveClient(nextClient) {
  if (activeClient2 && activeClient2 !== nextClient) {
    activeClient2.hideDropIndicator();
  }
  activeClient2 = nextClient;
}
function registerPointerDragTargetClient(client) {
  clients2.add(client);
  return () => {
    clients2.delete(client);
    if (activeClient2 === client) {
      client.hideDropIndicator();
      activeClient2 = null;
    }
  };
}
function schedulePointerDropIndicatorFromPoint(fallbackClient, clientX, clientY, dragSource, pointerType) {
  var _a;
  const targetClient = (_a = resolveClientAtPoint(clientX, clientY)) != null ? _a : fallbackClient;
  setActiveClient(targetClient);
  targetClient.scheduleDropIndicatorUpdate(clientX, clientY, dragSource, pointerType);
}
function performPointerDropAtPoint(fallbackClient, sourceBlock, clientX, clientY, pointerType) {
  var _a, _b;
  const targetClient = (_b = (_a = resolveClientAtPoint(clientX, clientY)) != null ? _a : activeClient2) != null ? _b : fallbackClient;
  targetClient.performDropAtPoint(sourceBlock, clientX, clientY, pointerType);
}
function hidePointerDropIndicators() {
  for (const client of clients2) {
    client.hideDropIndicator();
  }
  activeClient2 = null;
}

// src/plugin/block-type-menu.ts
var import_obsidian3 = require("obsidian");

// src/plugin/block-type-conversion.ts
var BLOCK_TYPE_CONVERSION_OPTIONS = [
  { id: "paragraph", label: "Paragraph", icon: "pilcrow" },
  { id: "heading-1", label: "Heading 1", icon: "heading-1" },
  { id: "heading-2", label: "Heading 2", icon: "heading-2" },
  { id: "heading-3", label: "Heading 3", icon: "heading-3" },
  { id: "bullet-list", label: "Bullet list", icon: "list" },
  { id: "ordered-list", label: "Ordered list", icon: "list-ordered" },
  { id: "task-list", label: "Task list", icon: "list-checks" },
  { id: "blockquote", label: "Quote", icon: "quote" },
  { id: "code-block", label: "Code block", icon: "code" }
];
function convertCurrentBlockType(view, conversion) {
  const block = getCurrentBlock(view);
  if (!block)
    return false;
  const changes = buildBlockTypeConversionChanges(view.state, block.startLine + 1, block.endLine + 1, conversion);
  if (changes.length === 0)
    return false;
  view.dispatch({
    changes,
    scrollIntoView: false
  });
  return true;
}
function deleteCurrentBlock(view) {
  const block = getCurrentBlock(view);
  if (!block)
    return false;
  const startLine = view.state.doc.line(block.startLine + 1);
  const endLine = view.state.doc.line(block.endLine + 1);
  const change = resolveDeleteRange(view.state.doc, startLine.from, endLine.to);
  if (change.from === change.to)
    return false;
  anchorSelectionBeforeUndoableChange(view, change.from);
  view.dispatch({
    changes: { from: change.from, to: change.to },
    scrollIntoView: false
  });
  return true;
}
function getCurrentBlock(view) {
  const head = view.state.selection.main.head;
  const lineNumber = view.state.doc.lineAt(head).number;
  const block = detectBlock(view.state, lineNumber);
  if (!block)
    return { startLine: lineNumber - 1, endLine: lineNumber - 1 };
  return { startLine: block.startLine, endLine: block.endLine };
}
function buildBlockTypeConversionChanges(state, startLineNumber, endLineNumber, conversion) {
  if (conversion === "code-block") {
    return buildCodeBlockChanges(state, startLineNumber, endLineNumber);
  }
  const changes = [];
  for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
    const line = state.doc.line(lineNumber);
    const next = convertLine(line.text, conversion, lineNumber - startLineNumber + 1);
    if (next === line.text)
      continue;
    changes.push({ from: line.from, to: line.to, insert: next });
  }
  return changes;
}
function buildCodeBlockChanges(state, startLineNumber, endLineNumber) {
  const startLine = state.doc.line(startLineNumber);
  const endLine = state.doc.line(endLineNumber);
  const content = state.doc.sliceString(startLine.from, endLine.to);
  if (content.startsWith("```") && content.endsWith("```"))
    return [];
  return [{ from: startLine.from, to: endLine.to, insert: `\`\`\`
${content}
\`\`\`` }];
}
function convertLine(text, conversion, ordinal) {
  const { quotePrefix, indentRaw, body } = stripKnownBlockPrefix(text);
  switch (conversion) {
    case "paragraph":
      return `${quotePrefix}${indentRaw}${body}`;
    case "heading-1":
      return `${quotePrefix}${indentRaw}# ${body}`;
    case "heading-2":
      return `${quotePrefix}${indentRaw}## ${body}`;
    case "heading-3":
      return `${quotePrefix}${indentRaw}### ${body}`;
    case "bullet-list":
      return `${quotePrefix}${indentRaw}- ${body}`;
    case "ordered-list":
      return `${quotePrefix}${indentRaw}${ordinal}. ${body}`;
    case "task-list":
      return `${quotePrefix}${indentRaw}- [ ] ${body}`;
    case "blockquote":
      return `> ${indentRaw}${body}`;
  }
}
function stripKnownBlockPrefix(text) {
  var _a, _b;
  const quoteMatch = text.match(/^(\s*>\s?)*/);
  const quotePrefix = (_a = quoteMatch == null ? void 0 : quoteMatch[0]) != null ? _a : "";
  const withoutQuote = text.slice(quotePrefix.length);
  const indentMatch = withoutQuote.match(/^(\s*)/);
  const indentRaw = (_b = indentMatch == null ? void 0 : indentMatch[0]) != null ? _b : "";
  let rest = withoutQuote.slice(indentRaw.length);
  rest = rest.replace(/^#{1,6}\s+/, "");
  const listMatch = rest.match(/^((?:[-*+]\s\[[ xX]\]\s+)|(?:[-*+]\s+)|(?:\d+[.)]\s+))/);
  if (listMatch) {
    rest = rest.slice(listMatch[0].length);
  }
  return { quotePrefix, indentRaw, body: rest };
}

// src/plugin/block-type-menu.ts
function openBlockTypeMenu(view, event) {
  const menu = new import_obsidian3.Menu();
  for (const option of BLOCK_TYPE_CONVERSION_OPTIONS) {
    menu.addItem(
      (item) => item.setTitle(option.label).setIcon(option.icon).onClick(() => {
        if (!convertCurrentBlockType(view, option.id)) {
          new import_obsidian3.Notice("Unable to change block type.");
        }
      })
    );
  }
  menu.addSeparator();
  menu.addItem(
    (item) => item.setTitle("Delete block").setIcon("trash-2").setWarning(true).onClick(() => {
      if (!deleteCurrentBlock(view)) {
        new import_obsidian3.Notice("Unable to delete block.");
      }
    })
  );
  if (event) {
    menu.showAtMouseEvent(event);
    return;
  }
  const coords = view.coordsAtPos(view.state.selection.main.head);
  if (coords) {
    menu.showAtPosition({ x: coords.left, y: coords.bottom });
    return;
  }
  menu.showAtPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
}

// src/runtime/editor-runtime.ts
function createDragHandleViewPluginClass(plugin) {
  return class {
    constructor(view) {
      this.lifecycleEmitter = new DragLifecycleEmitter(
        (event) => plugin.emitDragLifecycleEvent(event)
      );
      this.onDocumentPointerMove = (e) => this.handleDocumentPointerMove(e);
      this.onSettingsUpdated = () => this.handleSettingsUpdated();
      this.view = view;
      this.cachedHandleGutterSide = this.resolveConfiguredHandleGutterSide();
      this.syncViewDomState();
      this.services = new DragDropServiceContainer(this.view);
      this.handleVisibility = new HandleVisibilityController(this.view, {
        getBlockInfoForHandle: (handle) => this.services.dragSource.getBlockInfoForHandle(handle),
        getLineNumberAtVerticalPosition: (clientY, contentRect) => this.services.dragSource.getLineNumberAtVerticalPosition(clientY, contentRect),
        getDraggableBlockAtVerticalPosition: (clientY, contentRect) => this.services.dragSource.getDraggableBlockAtVerticalPosition(clientY, contentRect),
        getVisibleHandleForBlockStart: (blockStart) => getVisibleHandleForBlockStart(this.view, blockStart)
      });
      this.dragPerfManager = new DragPerfSessionManager(this.view);
      this.dropPlanner = new DropPlanner(this.view, createDropPlannerDeps({
        view: this.view,
        services: this.services,
        dragPerfManager: this.dragPerfManager
      }));
      this.dropIndicator = new DropIndicatorManager(
        view,
        (info) => {
          var _a, _b, _c;
          return this.dropPlanner.resolveValidatedDropTarget({
            clientX: info.clientX,
            clientY: info.clientY,
            dragSource: (_b = (_a = info.dragSource) != null ? _a : getActiveDragSourceBlock(this.view)) != null ? _b : null,
            pointerType: (_c = info.pointerType) != null ? _c : null,
            sourceScope: this.resolveDragSourceScope()
          });
        },
        {
          isDropHighlightEnabled: () => plugin.settings.enableListDropHighlight !== false,
          recordPerfDuration: (key, durationMs) => {
            this.dragPerfManager.recordDuration(key, durationMs);
          },
          onDropTargetEvaluated: ({ sourceBlock, pointerType, validation }) => {
            var _a, _b, _c, _d;
            if (!sourceBlock)
              return;
            this.orchestrator.emitDragLifecycle(buildDragTargetChangedLifecycleEvent({
              sourceBlock,
              targetLine: (_b = (_a = validation.plan) == null ? void 0 : _a.targetLineNumber) != null ? _b : null,
              listIntent: buildListIntent((_c = validation.plan) == null ? void 0 : _c.listIntent),
              rejectReason: validation.allowed ? null : (_d = validation.reason) != null ? _d : null,
              pointerType: pointerType != null ? pointerType : null
            }));
          },
          onFrameMetrics: (metrics) => {
            this.dragPerfManager.incrementCounter("drop_indicator_frames");
            if (metrics.skipped) {
              this.dragPerfManager.incrementCounter("drop_indicator_skipped_frames");
            }
            if (metrics.reused) {
              this.dragPerfManager.incrementCounter("drop_indicator_reused_frames");
            }
          }
        }
      );
      this.blockMover = new BlockMover({
        view: this.view,
        ...this.services.createBlockMoverDeps(),
        blockFoldState: createBlockFoldStateManager({
          app: plugin.app,
          parseLineWithQuote: (line) => this.services.textMutation.parseLineWithQuote(line)
        })
      });
      this.orchestrator = new DragInteractionOrchestrator({
        view: this.view,
        services: this.services,
        blockMover: this.blockMover,
        dropPlanner: this.dropPlanner,
        handleVisibility: this.handleVisibility,
        dragPerfManager: this.dragPerfManager,
        lifecycleEmitter: this.lifecycleEmitter,
        getSemanticRefreshScheduler: () => this.semanticRefreshScheduler,
        refreshDecorationsAndEmbeds: () => this.refreshDecorationsAndEmbeds(),
        resolveEditorDocumentKey: (editorView) => resolveEditorDocumentKey(plugin.app, editorView),
        allowCrossDocumentDrop: () => plugin.settings.enableCrossFileDrag === true
      });
      this.pointerDragTargetClient = {
        containsPoint: (clientX, clientY) => this.containsPoint(clientX, clientY),
        scheduleDropIndicatorUpdate: (clientX, clientY, dragSource, pointerType) => this.dropIndicator.scheduleFromPoint(clientX, clientY, dragSource, pointerType),
        hideDropIndicator: () => this.dropIndicator.hide(),
        performDropAtPoint: (sourceBlock, clientX, clientY, pointerType) => this.orchestrator.performDropAtPoint(sourceBlock, clientX, clientY, pointerType)
      };
      this.unregisterPointerDragTargetClient = registerPointerDragTargetClient(this.pointerDragTargetClient);
      this.dragEventHandler = new DragEventHandler(this.view, {
        getBlockInfoForHandle: (handle) => this.orchestrator.resolveInteractionBlockInfo({
          handle,
          clientX: Number.NaN,
          clientY: Number.NaN
        }),
        getBlockInfoAtPoint: (clientX, clientY) => this.orchestrator.resolveInteractionBlockInfo({
          clientX,
          clientY
        }),
        getVisibleHandleForBlockStart: (blockStart) => getVisibleHandleForBlockStart(this.view, blockStart),
        isBlockInsideRenderedTableCell: (blockInfo) => isPosInsideRenderedTableCell(this.view, blockInfo.from, { skipLayoutRead: true }),
        isMultiLineSelectionEnabled: () => plugin.settings.enableMultiLineSelection,
        getMultiLineSelectionLongPressMs: () => plugin.settings.multiLineSelectionLongPressMs,
        isMobileTextLongPressDragEnabled: () => plugin.settings.enableMobileTextLongPressDrag,
        beginPointerDragSession: (blockInfo) => {
          this.orchestrator.ensureDragPerfSession();
          beginDragSession(blockInfo, this.view);
        },
        finishDragSession: () => {
          this.handleVisibility.clearGrabbedLineNumbers();
          this.handleVisibility.setActiveVisibleHandle(null);
          finishDragSession(this.view);
          hidePointerDropIndicators();
          this.orchestrator.flushDragPerfSession("finish_drag_session");
          this.refreshDecorationsAndEmbeds();
        },
        scheduleDropIndicatorUpdate: (clientX, clientY, dragSource, pointerType) => schedulePointerDropIndicatorFromPoint(
          this.pointerDragTargetClient,
          clientX,
          clientY,
          dragSource,
          pointerType != null ? pointerType : null
        ),
        hideDropIndicator: () => this.dropIndicator.hide(),
        performDropAtPoint: (sourceBlock, clientX, clientY, pointerType) => performPointerDropAtPoint(
          this.pointerDragTargetClient,
          sourceBlock,
          clientX,
          clientY,
          pointerType != null ? pointerType : null
        ),
        onDragLifecycleEvent: (event) => {
          this.handleSourceVisualByLifecycle(event);
          this.orchestrator.emitDragLifecycle(event);
        },
        openBlockTypeMenu: (blockInfo, event) => {
          const anchor = Math.max(0, Math.min(this.view.state.doc.length, blockInfo.from));
          this.view.dispatch({ selection: { anchor }, scrollIntoView: false });
          openBlockTypeMenu(this.view, event);
        }
      });
      this.semanticRefreshScheduler = new SemanticRefreshScheduler(this.view, {
        performRefresh: () => this.refreshDecorationsAndEmbeds()
      });
      this.pointerMoveClient = {
        view: this.view,
        onPointerMove: this.onDocumentPointerMove,
        clearPointerHover: () => this.handleVisibility.setActiveVisibleHandle(null)
      };
      startViewLifecycle({
        view: this.view,
        dragEventHandler: this.dragEventHandler,
        pointerMoveClient: this.pointerMoveClient,
        onSettingsUpdated: this.onSettingsUpdated
      });
      this.syncViewDomState();
    }
    update(update) {
      this.syncViewDomState();
      applyViewUpdate(update, {
        refreshDecorationsAndEmbeds: () => this.refreshDecorationsAndEmbeds(),
        dragEventHandler: this.dragEventHandler,
        handleVisibility: this.handleVisibility,
        semanticRefreshScheduler: this.semanticRefreshScheduler,
        reResolveActiveHandle: () => {
          const h = this.handleVisibility.getActiveHandle();
          if (h) {
            const rect = h.getBoundingClientRect();
            this.reResolveActiveHandle(rect.left + rect.width / 2, rect.top + rect.height / 2);
          }
        }
      });
    }
    destroy() {
      destroyViewLifecycle({
        semanticRefreshScheduler: this.semanticRefreshScheduler,
        pointerMoveClient: this.pointerMoveClient,
        onSettingsUpdated: this.onSettingsUpdated,
        dragEventHandler: this.dragEventHandler
      });
      this.handleVisibility.clearGrabbedLineNumbers();
      this.handleVisibility.setActiveVisibleHandle(null);
      this.unregisterPointerDragTargetClient();
      finishDragSession(this.view);
      this.orchestrator.flushDragPerfSession("destroy");
      clearEditorRootClasses(this.view);
      this.view.dom.removeAttribute(DND_DRAG_SOURCE_STYLE_ATTR);
      this.view.dom.removeAttribute(DND_DRAG_SOURCE_HIGHLIGHT_ATTR);
      this.dropIndicator.destroy();
      this.orchestrator.emitDragLifecycle(buildIdleLifecycleEvent());
    }
    handleDocumentPointerMove(e) {
      if (document.body.classList.contains(MOBILE_GESTURE_LOCK_CLASS)) {
        return;
      }
      if (document.body.classList.contains(DRAGGING_BODY_CLASS)) {
        this.handleVisibility.setActiveVisibleHandle(null);
        return;
      }
      if (this.dragEventHandler.isGestureActive()) {
        this.handleVisibility.setActiveVisibleHandle(this.handleVisibility.getActiveHandle());
        return;
      }
      const hoverSnapshot = this.createHoverPointerSnapshot(e.clientX, e.clientY);
      if (this.semanticRefreshScheduler.isPending && hoverSnapshot.withinHoverActivationZone) {
        this.semanticRefreshScheduler.ensureSemanticReadyForInteraction();
      }
      const directHandle = this.handleVisibility.resolveVisibleHandleFromTarget(e.target);
      if (directHandle) {
        this.handleVisibility.setActiveVisibleHandle(directHandle);
        return;
      }
      const handle = this.handleVisibility.resolveVisibleHandleFromPointer(hoverSnapshot);
      this.handleVisibility.setActiveVisibleHandle(handle);
    }
    reResolveActiveHandle(lastX, lastY) {
      if (lastX === void 0 || lastY === void 0)
        return;
      const handle = this.handleVisibility.resolveVisibleHandleFromPointer(
        this.createHoverPointerSnapshot(lastX, lastY)
      );
      this.handleVisibility.setActiveVisibleHandle(handle);
    }
    syncViewDomState() {
      ensureEditorRootClasses(this.view);
      placeHandleGutterForConfiguredSide(this.view, this.resolveConfiguredHandleGutterSide());
      syncDragSourceStyleAttr(this.view, normalizeDragSourceVisualStyle(plugin.settings.dragSourceVisualStyle));
      syncDragSourceHighlightAttr(this.view, this.isDragSourceHighlightEnabled());
    }
    isDragSourceHighlightEnabled() {
      return plugin.settings.enableDragSourceHighlight !== false;
    }
    refreshDecorationsAndEmbeds() {
      this.syncViewDomState();
      this.semanticRefreshScheduler.clearPendingSemanticRefresh();
    }
    handleSettingsUpdated() {
      this.cachedHandleGutterSide = this.resolveConfiguredHandleGutterSide();
      this.syncViewDomState();
      this.refreshDecorationsAndEmbeds();
      this.dragEventHandler.refreshSelectionVisual();
      this.handleVisibility.refreshGrabVisualState();
    }
    createHoverPointerSnapshot(clientX, clientY) {
      return createHoverPointerSnapshot(this.view, clientX, clientY, this.cachedHandleGutterSide);
    }
    containsPoint(clientX, clientY) {
      const rect = this.view.dom.getBoundingClientRect();
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    }
    resolveConfiguredHandleGutterSide() {
      return plugin.settings.handleGutterPosition === "right" ? "right" : "left";
    }
    handleSourceVisualByLifecycle(event) {
      if (event.type === "drag_press_pending") {
        if (event.pressReady && event.sourceBlock && this.isDragSourceHighlightEnabled()) {
          this.handleVisibility.enterGrabVisualStateForBlock(event.sourceBlock, null);
        } else {
          this.handleVisibility.clearGrabbedLineNumbers();
        }
        return;
      }
      if (event.type === "drag_started") {
        if (event.sourceBlock && this.isDragSourceHighlightEnabled()) {
          this.handleVisibility.enterGrabVisualStateForBlock(event.sourceBlock, null);
        } else if (!this.isDragSourceHighlightEnabled()) {
          this.handleVisibility.clearGrabbedLineNumbers();
        }
        return;
      }
      if (event.type === "drag_cancelled" || event.type === "drag_idle") {
        if (getActiveDragSourceBlock(this.view))
          return;
        this.handleVisibility.clearGrabbedLineNumbers();
        return;
      }
      if (event.type === "drag_drop_commit") {
        this.handleVisibility.clearGrabbedLineNumbers();
      }
    }
    resolveDragSourceScope() {
      const sourceView = getActiveDragSourceView();
      if (!sourceView || sourceView === this.view) {
        return "same_editor";
      }
      return "cross_editor";
    }
  };
}

// src/runtime/handle-gutter-extension.ts
var import_view2 = require("@codemirror/view");

// src/drag/source/handle-block-resolver.ts
function resolveHandleBlockAtLine(state, lineNumber) {
  const block = detectBlock(state, lineNumber);
  if (!block)
    return null;
  if (block.startLine + 1 !== lineNumber)
    return null;
  return block;
}

// src/runtime/handle-gutter-extension.ts
function resolveLineNumber(view, line) {
  return view.state.doc.lineAt(line.from).number;
}
function createHandleGutterExtension() {
  return (0, import_view2.gutter)({
    class: HANDLE_GUTTER_CLASS,
    side: "before",
    renderEmptyElements: false,
    lineMarker: (view, line) => {
      const block = resolveHandleBlockAtLine(view.state, resolveLineNumber(view, line));
      return block ? new HandleGutterLineMarker(block) : null;
    },
    lineMarkerChange: (update) => update.docChanged || update.viewportChanged || update.geometryChanged
  });
}

// src/runtime/editor-extension.ts
function createDragHandleViewPlugin(plugin) {
  return import_view3.ViewPlugin.fromClass(
    createDragHandleViewPluginClass(plugin)
  );
}
function dragHandleExtension(plugin) {
  return [
    createHandleGutterExtension(),
    createDragHandleViewPlugin(plugin)
  ];
}

// src/platform/obsidian/external-file-drop-controller.ts
var import_obsidian4 = require("obsidian");

// src/drag/move/file-mover.ts
var FileBlockMover = class {
  constructor(app) {
    this.app = app;
  }
  async moveBlockToFile(params) {
    const { sourceView, sourceBlock, targetFile } = params;
    if (targetFile.extension !== "md") {
      return { moved: false, reason: "target_not_markdown" };
    }
    const payload = captureSourcePayload(sourceView.state.doc, sourceBlock);
    if (!payload || payload.content.length === 0) {
      return { moved: false, reason: "empty_source" };
    }
    const targetView = this.getOpenMarkdownEditorView(targetFile);
    if (targetView === sourceView) {
      this.moveWithinSameEditorToEnd(sourceView, payload);
      this.renumberSourceLists(sourceView, payload);
      return { moved: true };
    }
    if (targetView) {
      this.appendToEditor(targetView, payload.content);
      this.deleteSourcePayload(sourceView, payload);
      this.renumberSourceLists(sourceView, payload);
      return { moved: true };
    }
    await this.app.vault.process(targetFile, (data) => appendMarkdownBlock(data, payload.content));
    this.deleteSourcePayload(sourceView, payload);
    this.renumberSourceLists(sourceView, payload);
    return { moved: true };
  }
  getOpenMarkdownEditorView(file) {
    var _a, _b;
    for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
      const view = leaf.view;
      if (((_a = view.getViewType) == null ? void 0 : _a.call(view)) !== "markdown")
        continue;
      const markdownView = view;
      if (((_b = markdownView.file) == null ? void 0 : _b.path) !== file.path)
        continue;
      return getCodeMirrorView(markdownView);
    }
    return null;
  }
  appendToEditor(view, content) {
    const doc = view.state.doc;
    const insert = buildAppendInsertion(doc.sliceString(0, doc.length), content);
    if (!insert.length)
      return;
    anchorSelectionBeforeUndoableChange(view, doc.length);
    view.dispatch({
      changes: { from: doc.length, to: doc.length, insert },
      scrollIntoView: false
    });
  }
  deleteSourcePayload(sourceView, payload) {
    var _a, _b;
    const changes = this.getMergedDeleteChanges(payload).sort((a, b) => b.from - a.from);
    if (changes.length === 0)
      return;
    anchorSelectionBeforeUndoableChange(sourceView, (_b = (_a = payload.segments[0]) == null ? void 0 : _a.deleteFrom) != null ? _b : 0);
    sourceView.dispatch({
      changes,
      scrollIntoView: false
    });
  }
  moveWithinSameEditorToEnd(view, payload) {
    var _a, _b;
    const doc = view.state.doc;
    const deletes = this.getMergedDeleteChanges(payload);
    const remainingText = applyDeleteChanges(doc.sliceString(0, doc.length), deletes);
    const insert = buildAppendInsertion(remainingText, payload.content);
    const changes = [
      ...deletes,
      ...insert.length ? [{ from: doc.length, to: doc.length, insert }] : []
    ].sort((a, b) => b.from - a.from);
    if (changes.length === 0)
      return;
    anchorSelectionBeforeUndoableChange(view, (_b = (_a = payload.segments[0]) == null ? void 0 : _a.deleteFrom) != null ? _b : 0);
    view.dispatch({
      changes,
      scrollIntoView: false
    });
  }
  getMergedDeleteChanges(payload) {
    const sorted = payload.segments.map((segment) => ({
      from: segment.deleteFrom,
      to: segment.deleteTo
    })).sort((a, b) => a.from - b.from);
    const merged = [];
    for (const change of sorted) {
      const last = merged[merged.length - 1];
      if (!last) {
        merged.push(change);
        continue;
      }
      if (change.from <= last.to) {
        last.to = Math.max(last.to, change.to);
        continue;
      }
      merged.push(change);
    }
    return merged;
  }
  renumberSourceLists(sourceView, payload) {
    const lineParsing = new LineParsingService(sourceView);
    const renumberer = new ListRenumberer({
      view: sourceView,
      parseLineWithQuote: (line) => lineParsing.parseLine(line)
    });
    const lineNumbers = new Set(payload.segments.map((segment) => segment.startLineNumber));
    for (const lineNumber of lineNumbers) {
      renumberer.renumberOrderedListAround(lineNumber);
    }
  }
};
function appendMarkdownBlock(existing, blockContent) {
  const insert = buildAppendInsertion(existing, blockContent);
  return insert.length ? `${existing}${insert}` : existing;
}
function buildAppendInsertion(existing, blockContent) {
  const normalized = blockContent.replace(/\n+$/, "");
  if (!normalized.length)
    return "";
  if (!existing.length)
    return normalized;
  if (existing.endsWith("\n\n"))
    return normalized;
  if (existing.endsWith("\n"))
    return `
${normalized}`;
  return `

${normalized}`;
}
function applyDeleteChanges(existing, deletes) {
  let result = "";
  let cursor = 0;
  for (const change of deletes) {
    result += existing.slice(cursor, change.from);
    cursor = change.to;
  }
  return result + existing.slice(cursor);
}

// src/platform/obsidian/external-file-drop-controller.ts
var SIDEBAR_FILE_SELECTOR = ".nav-file-title[data-path]";
var INTERNAL_LINK_SELECTOR = "a.internal-link, .internal-link[data-href], .cm-hmd-internal-link[data-href]";
var ExternalFileDropController = class {
  constructor(plugin) {
    this.plugin = plugin;
    this.highlightedTarget = null;
    this.pointerDragTargetClient = {
      containsPoint: (clientX, clientY) => this.resolveDropTargetAtPoint(clientX, clientY) !== null,
      scheduleDropIndicatorUpdate: (clientX, clientY) => {
        const target = this.resolveDropTargetAtPoint(clientX, clientY);
        if (!target) {
          this.clearHighlight();
          return;
        }
        this.setHighlightedTarget(target.element);
      },
      hideDropIndicator: () => this.clearHighlight(),
      performDropAtPoint: (sourceBlock, clientX, clientY) => this.performDropAtPoint(sourceBlock, clientX, clientY)
    };
    this.fileBlockMover = new FileBlockMover(plugin.app);
  }
  register() {
    const unregister = registerPointerDragTargetClient(this.pointerDragTargetClient);
    this.plugin.register(() => {
      unregister();
      this.clearHighlight();
    });
  }
  performDropAtPoint(sourceBlock, clientX, clientY) {
    const target = this.resolveDropTargetAtPoint(clientX, clientY);
    if (!target) {
      this.clearHighlight();
      return;
    }
    this.clearHighlight();
    const sourceView = getActiveDragSourceView();
    if (!sourceView) {
      new import_obsidian4.Notice("Dragger could not find the dragged block.");
      return;
    }
    void this.fileBlockMover.moveBlockToFile({
      sourceView,
      sourceBlock,
      targetFile: target.file
    }).then((result) => {
      if (!result.moved) {
        new import_obsidian4.Notice("Dragger could not move this block to the target note.");
      }
    }).catch((error) => {
      console.error("[Dragger] failed to move block to file target:", error);
      new import_obsidian4.Notice("Dragger could not move this block to the target note.");
    });
  }
  resolveDropTargetAtPoint(clientX, clientY) {
    if (typeof document.elementFromPoint !== "function")
      return null;
    const target = document.elementFromPoint(clientX, clientY);
    return this.resolveDropTargetFromElement(target instanceof HTMLElement ? target : null);
  }
  resolveDropTargetFromElement(target) {
    if (!target)
      return null;
    if (!this.isFileDropEnabled())
      return null;
    const sidebarFile = target.closest(SIDEBAR_FILE_SELECTOR);
    if (sidebarFile) {
      const file2 = this.resolveSidebarFileTarget(sidebarFile);
      if (file2)
        return { file: file2, element: sidebarFile };
    }
    const link = target.closest(INTERNAL_LINK_SELECTOR);
    if (!link)
      return null;
    const file = this.resolveInternalLinkTarget(link);
    if (!file)
      return null;
    return { file, element: link };
  }
  resolveSidebarFileTarget(element) {
    const rawPath = element.getAttribute("data-path");
    if (!rawPath)
      return null;
    return this.resolveMarkdownFileByVaultPath(rawPath);
  }
  resolveInternalLinkTarget(element) {
    const rawLinkpath = this.getInternalLinkPath(element);
    if (!rawLinkpath)
      return null;
    const contextPath = this.resolveLinkContextPath(element);
    if (rawLinkpath.startsWith("#")) {
      return contextPath ? this.resolveMarkdownFileByVaultPath(contextPath) : null;
    }
    const cleanLinkpath = stripSubpath(rawLinkpath);
    if (!cleanLinkpath)
      return null;
    const resolved = this.plugin.app.metadataCache.getFirstLinkpathDest(cleanLinkpath, contextPath != null ? contextPath : "");
    if (isMarkdownFile(resolved))
      return resolved;
    return this.resolveMarkdownFileByVaultPath(cleanLinkpath);
  }
  getInternalLinkPath(element) {
    const rawDataHref = element.getAttribute("data-href");
    if (rawDataHref)
      return normalizeInternalLinkAttribute(rawDataHref);
    if (element instanceof HTMLAnchorElement) {
      const rawHref = element.getAttribute("href");
      if (rawHref)
        return normalizeInternalLinkAttribute(rawHref);
    }
    return null;
  }
  resolveLinkContextPath(element) {
    var _a, _b, _c, _d, _e, _f, _g;
    for (const leaf of this.plugin.app.workspace.getLeavesOfType("markdown")) {
      const view = leaf.view;
      if (((_a = view.getViewType) == null ? void 0 : _a.call(view)) !== "markdown")
        continue;
      if (!((_b = view.containerEl) == null ? void 0 : _b.contains(element)))
        continue;
      return (_d = (_c = view.file) == null ? void 0 : _c.path) != null ? _d : null;
    }
    const sourceView = getActiveDragSourceView();
    if (!sourceView)
      return null;
    for (const leaf of this.plugin.app.workspace.getLeavesOfType("markdown")) {
      const view = leaf.view;
      if (((_e = view.editor) == null ? void 0 : _e.cm) === sourceView) {
        return (_g = (_f = view.file) == null ? void 0 : _f.path) != null ? _g : null;
      }
    }
    return null;
  }
  resolveMarkdownFileByVaultPath(path) {
    var _a, _b, _c;
    const cleaned = stripSubpath(path);
    if (!cleaned)
      return null;
    const candidates = cleaned.endsWith(".md") ? [cleaned] : [cleaned, `${cleaned}.md`];
    for (const candidate of candidates) {
      const normalized = (0, import_obsidian4.normalizePath)(candidate);
      const file = (_c = (_b = (_a = this.plugin.app.vault).getFileByPath) == null ? void 0 : _b.call(_a, normalized)) != null ? _c : this.plugin.app.vault.getAbstractFileByPath(normalized);
      if (isMarkdownFile(file))
        return file;
    }
    return null;
  }
  isFileDropEnabled() {
    return this.plugin.settings.enableCrossFileDrag === true;
  }
  setHighlightedTarget(element) {
    if (this.highlightedTarget === element)
      return;
    this.clearHighlight();
    this.highlightedTarget = element;
    element.classList.add(FILE_DROP_TARGET_CLASS);
  }
  clearHighlight() {
    var _a;
    (_a = this.highlightedTarget) == null ? void 0 : _a.classList.remove(FILE_DROP_TARGET_CLASS);
    this.highlightedTarget = null;
  }
};
function normalizeInternalLinkAttribute(value) {
  let linkpath = safelyDecodeURIComponent(value.trim());
  if (!linkpath.length)
    return null;
  if (/^(https?|mailto):/i.test(linkpath))
    return null;
  if (linkpath.startsWith("#")) {
    return linkpath;
  }
  if (linkpath.startsWith("/")) {
    linkpath = linkpath.slice(1);
  }
  const aliasIndex = linkpath.indexOf("|");
  if (aliasIndex >= 0) {
    linkpath = linkpath.slice(0, aliasIndex);
  }
  return linkpath.trim() || null;
}
function stripSubpath(path) {
  const hashIndex = path.indexOf("#");
  return (hashIndex >= 0 ? path.slice(0, hashIndex) : path).trim();
}
function safelyDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch (e) {
    return value;
  }
}
function isMarkdownFile(file) {
  const candidate = file;
  return !!candidate && typeof candidate.path === "string" && candidate.extension === "md";
}

// src/plugin/mobile-toolbar-commands.ts
var import_obsidian5 = require("obsidian");

// src/platform/obsidian/workspace.ts
function getActiveLeaf(app) {
  var _a;
  return (_a = app.workspace.getMostRecentLeaf()) != null ? _a : null;
}

// src/platform/obsidian/app-adapter.ts
function getActiveMarkdownView(app) {
  var _a;
  const leaf = getActiveLeaf(app);
  if (!leaf)
    return null;
  const view = leaf.view;
  return ((_a = view.getViewType) == null ? void 0 : _a.call(view)) === "markdown" ? view : null;
}

// src/plugin/mobile-toolbar-commands.ts
function getActiveEditorView(app) {
  const markdownView = getActiveMarkdownView(app);
  if (!markdownView)
    return null;
  return getCodeMirrorView(markdownView);
}
function registerMobileToolbarCommands(plugin) {
  plugin.addCommand({
    id: "open-current-block-type-menu",
    name: "Change current block type",
    icon: "replace",
    mobileOnly: true,
    checkCallback: (checking) => {
      if (!import_obsidian5.Platform.isMobile)
        return false;
      const view = getActiveEditorView(plugin.app);
      if (!view)
        return false;
      if (!checking) {
        openBlockTypeMenu(view, null);
      }
      return true;
    }
  });
  plugin.addCommand({
    id: "enter-mobile-block-multi-select",
    name: "Select multiple blocks",
    icon: "list-checks",
    mobileOnly: true,
    checkCallback: (checking) => {
      if (!import_obsidian5.Platform.isMobile)
        return false;
      const view = getActiveEditorView(plugin.app);
      if (!view)
        return false;
      if (!checking) {
        const event = new CustomEvent("dnd:enter-mobile-selection-mode", {
          bubbles: true,
          detail: { handled: false }
        });
        view.dom.dispatchEvent(event);
        if (!event.detail.handled) {
          new import_obsidian5.Notice("Unable to enter block selection mode.");
        }
      }
      return true;
    }
  });
}

// src/plugin/main.ts
var DragNDropPlugin = class extends import_obsidian6.Plugin {
  constructor() {
    super(...arguments);
    this.dragLifecycleListeners = /* @__PURE__ */ new Set();
  }
  async onload() {
    await this.loadSettings();
    this.registerEditorExtension(dragHandleExtension(this));
    registerMobileToolbarCommands(this);
    const externalFileDropController = new ExternalFileDropController(this);
    externalFileDropController.register();
    this.addSettingTab(new DragNDropSettingTab(this.app, this));
  }
  onunload() {
    this.dragLifecycleListeners.clear();
  }
  async loadSettings() {
    var _a;
    const saved = (_a = await this.loadData()) != null ? _a : {};
    this.settings = Object.assign({}, DEFAULT_SETTINGS, saved);
    const savedRecord = saved;
    if ("alwaysShowHandles" in saved && !("handleVisibility" in saved)) {
      this.settings.handleVisibility = saved.alwaysShowHandles ? "always" : "hover";
    }
    if (savedRecord.dragSourceVisualStyle === "none") {
      if (!("enableDragSourceHighlight" in savedRecord)) {
        this.settings.enableDragSourceHighlight = false;
      }
      if (!("enableListDropHighlight" in savedRecord)) {
        this.settings.enableListDropHighlight = false;
      }
    }
    this.settings.enableDragSourceHighlight = this.settings.enableDragSourceHighlight !== false;
    this.settings.enableListDropHighlight = this.settings.enableListDropHighlight !== false;
    this.settings.enableCrossFileDrag = this.settings.enableCrossFileDrag === true;
    this.settings.multiLineSelectionLongPressMs = normalizeMultiLineSelectionLongPressMs(
      this.settings.multiLineSelectionLongPressMs
    );
    this.settings.handleGutterPosition = normalizeHandleGutterPosition(this.settings.handleGutterPosition);
    await this.saveData(this.settings);
    this.applySettings();
  }
  async saveSettings() {
    this.applySettings();
    await this.saveData(this.settings);
  }
  applySettings() {
    var _a, _b, _c;
    const body = document.body;
    const visibility = (_a = this.settings.handleVisibility) != null ? _a : "hover";
    body.classList.toggle("dnd-handles-always", visibility === "always");
    body.classList.toggle("dnd-handles-hidden", visibility === "hidden");
    this.settings.multiLineSelectionLongPressMs = normalizeMultiLineSelectionLongPressMs(
      this.settings.multiLineSelectionLongPressMs
    );
    const dragSourceVisualStyle = normalizeDragSourceVisualStyle(this.settings.dragSourceVisualStyle);
    this.settings.dragSourceVisualStyle = dragSourceVisualStyle;
    body.setAttribute(DND_DRAG_SOURCE_STYLE_ATTR, dragSourceVisualStyle);
    body.setAttribute(DND_DRAG_SOURCE_HIGHLIGHT_ATTR, this.settings.enableDragSourceHighlight ? "on" : "off");
    body.setAttribute(DND_LIST_DROP_HIGHLIGHT_ATTR, this.settings.enableListDropHighlight ? "on" : "off");
    const rawHandleOffset = Number(this.settings.handleHorizontalOffsetPx);
    const handleOffset = Number.isFinite(rawHandleOffset) ? Math.max(-80, Math.min(80, Math.round(rawHandleOffset))) : DEFAULT_SETTINGS.handleHorizontalOffsetPx;
    this.settings.handleHorizontalOffsetPx = handleOffset;
    this.settings.handleGutterPosition = normalizeHandleGutterPosition(this.settings.handleGutterPosition);
    setHandleHorizontalOffsetPx(handleOffset);
    body.setCssProps({
      "--dnd-handle-horizontal-offset-px": `${handleOffset}px`
    });
    let colorValue = "";
    if (this.settings.handleColorMode === "theme") {
      colorValue = "var(--interactive-accent)";
    } else if (this.settings.handleColor) {
      colorValue = this.settings.handleColor;
    }
    if (colorValue) {
      body.setCssProps({
        "--dnd-handle-color": colorValue,
        "--dnd-handle-color-hover": colorValue
      });
    } else {
      body.setCssProps({
        "--dnd-handle-color": "",
        "--dnd-handle-color-hover": ""
      });
    }
    let indicatorColorValue = "";
    if (this.settings.indicatorColorMode === "theme") {
      indicatorColorValue = "var(--interactive-accent)";
    } else if (this.settings.indicatorColor) {
      indicatorColorValue = this.settings.indicatorColor;
    }
    if (indicatorColorValue) {
      body.setCssProps({
        "--dnd-drop-indicator-color": indicatorColorValue
      });
    } else {
      body.setCssProps({
        "--dnd-drop-indicator-color": ""
      });
    }
    const handleSize = Math.max(
      MIN_HANDLE_SIZE_PX,
      Math.min(MAX_HANDLE_SIZE_PX, (_b = this.settings.handleSize) != null ? _b : DEFAULT_HANDLE_SIZE_PX)
    );
    setHandleSizePx(handleSize);
    body.setCssProps({
      "--dnd-handle-size": `${handleSize}px`,
      "--dnd-handle-core-size": `${Math.round(handleSize * HANDLE_CORE_SIZE_RATIO)}px`,
      "--dnd-grip-dots-core-size": `${Math.round(handleSize * GRIP_DOTS_CORE_SIZE_RATIO)}px`
    });
    body.setAttribute(DND_HANDLE_ICON_ATTR, (_c = this.settings.handleIcon) != null ? _c : "grip-dots");
    window.dispatchEvent(new Event("dnd:settings-updated"));
  }
  onDragLifecycleEvent(listener) {
    this.dragLifecycleListeners.add(listener);
    return () => {
      this.dragLifecycleListeners.delete(listener);
    };
  }
  emitDragLifecycleEvent(event) {
    for (const listener of Array.from(this.dragLifecycleListeners)) {
      try {
        listener(event);
      } catch (error) {
        console.error("[Dragger] drag lifecycle listener failed:", error);
      }
    }
  }
};

/* nosourcemap */