"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/pages/calculator/page",{

/***/ "(app-pages-browser)/./src/app/components/SALCal.js":
/*!**************************************!*\
  !*** ./src/app/components/SALCal.js ***!
  \**************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/layout/dist/chunk-PULVB27S.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/layout/dist/chunk-2OOHT3W5.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/layout/dist/chunk-KRPLQIP4.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/slider/dist/chunk-6KSEUUNN.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/tooltip/dist/chunk-TK6VMDNP.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/input/dist/chunk-6CVSDS6C.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/button/dist/chunk-UVUR7MCU.mjs\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\nconst SalaryCalculator = ()=>{\n    var _this = undefined;\n    _s();\n    var _s1 = $RefreshSig$();\n    const [basicSalary, setBasicSalary] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(10000);\n    const [hra, setHra] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(10);\n    const [ta, setTa] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(10);\n    const [pf, setPf] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(5);\n    const [tax, setTax] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(10000);\n    const [otherDeductions, setOtherDeductions] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(500);\n    const [grossSalary, setGrossSalary] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const calculateSalary = ()=>{\n        const hraAmount = basicSalary * (hra / 100);\n        const pfAmount = basicSalary * (pf / 100);\n        const totalGrossSalary = basicSalary + hraAmount + ta - pfAmount - tax - otherDeductions;\n        setGrossSalary(totalGrossSalary.toFixed(2));\n    };\n    const renderSliderWithTextbox = function(label, value, setValue, min, max, step) {\n        let unit = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : \"\";\n        _s1();\n        const [showTooltip, setShowTooltip] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__.Box, {\n            mb: 6,\n            width: \"100%\",\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__.Text, {\n                    mb: 2,\n                    children: label\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                    lineNumber: 40,\n                    columnNumber: 9\n                }, _this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_4__.Flex, {\n                    alignItems: \"center\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_5__.Slider, {\n                            flex: \"1\",\n                            defaultValue: value,\n                            min: min,\n                            max: max,\n                            step: step,\n                            value: value,\n                            onChange: (v)=>setValue(v),\n                            onMouseEnter: ()=>setShowTooltip(true),\n                            onMouseLeave: ()=>setShowTooltip(false),\n                            colorScheme: \"teal\",\n                            mr: 4,\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_5__.SliderTrack, {\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_5__.SliderFilledTrack, {}, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                                        lineNumber: 56,\n                                        columnNumber: 15\n                                    }, _this)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                                    lineNumber: 55,\n                                    columnNumber: 13\n                                }, _this),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_6__.Tooltip, {\n                                    hasArrow: true,\n                                    bg: \"teal.500\",\n                                    color: \"white\",\n                                    placement: \"top\",\n                                    isOpen: showTooltip,\n                                    label: \"\".concat(value).concat(unit),\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_5__.SliderThumb, {}, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                                        lineNumber: 66,\n                                        columnNumber: 15\n                                    }, _this)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                                    lineNumber: 58,\n                                    columnNumber: 13\n                                }, _this)\n                            ]\n                        }, void 0, true, {\n                            fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                            lineNumber: 42,\n                            columnNumber: 11\n                        }, _this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_7__.Input, {\n                            width: \"100px\",\n                            value: value,\n                            onChange: (e)=>setValue(parseFloat(e.target.value) || 0),\n                            type: \"number\",\n                            textAlign: \"center\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                            lineNumber: 69,\n                            columnNumber: 11\n                        }, _this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                    lineNumber: 41,\n                    columnNumber: 9\n                }, _this)\n            ]\n        }, void 0, true, {\n            fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n            lineNumber: 39,\n            columnNumber: 7\n        }, _this);\n    };\n    _s1(renderSliderWithTextbox, \"MlKqB7CDspaiqeinDL2ipSY+OVU=\");\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__.Box, {\n        display: \"flex\",\n        flexDirection: \"column\",\n        alignItems: \"center\",\n        justifyContent: \"center\",\n        p: 6,\n        bg: \"rgba(117, 122, 140,0.299)\",\n        color: \"white\",\n        borderRadius: \"xl\",\n        shadow: \"md\",\n        width: \"100%\",\n        maxWidth: \"400px\",\n        mx: \"auto\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__.Text, {\n                fontSize: \"2xl\",\n                fontWeight: \"bold\",\n                mb: 6,\n                textAlign: \"center\",\n                children: \"Salary Calculator\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                lineNumber: 96,\n                columnNumber: 7\n            }, undefined),\n            renderSliderWithTextbox(\"Basic Salary (₹)\", basicSalary, setBasicSalary, 5000, 1000000, 1000, \"₹\"),\n            renderSliderWithTextbox(\"HRA (%)\", hra, setHra, 0, 100, 0.5, \"%\"),\n            renderSliderWithTextbox(\"TA (%)\", ta, setTa, 0, 100, 0.5, \"%\"),\n            renderSliderWithTextbox(\"Tax (₹)\", tax, setTax, 0, 100000, 100, \"₹\"),\n            renderSliderWithTextbox(\"Other Deductions (₹)\", otherDeductions, setOtherDeductions, 0, 10000, 100, \"₹\"),\n            renderSliderWithTextbox(\"PF (%)\", pf, setPf, 0, 20, 0.5, \"%\"),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_8__.Button, {\n                color: \"#ebeff4\",\n                bgGradient: \"linear(to-r, #0075ff ,  #9f7aea)\",\n                onClick: calculateSalary,\n                width: \"100%\",\n                mb: 4,\n                children: \"Calculate Salary\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                lineNumber: 108,\n                columnNumber: 7\n            }, undefined),\n            grossSalary && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__.Text, {\n                fontSize: \"lg\",\n                color: \"green.500\",\n                mt: 4,\n                children: [\n                    \"Gross Salary: ₹\",\n                    grossSalary\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                lineNumber: 119,\n                columnNumber: 9\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n        lineNumber: 82,\n        columnNumber: 5\n    }, undefined);\n};\n_s(SalaryCalculator, \"uL5CZ3Dx74e1+yYfLxuA9ZBLFqU=\");\n_c = SalaryCalculator;\n/* harmony default export */ __webpack_exports__[\"default\"] = (SalaryCalculator);\nvar _c;\n$RefreshReg$(_c, \"SalaryCalculator\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvY29tcG9uZW50cy9TQUxDYWwuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQWEwQjtBQUNjO0FBRXhDLE1BQU1hLG1CQUFtQjs7OztJQUN2QixNQUFNLENBQUNDLGFBQWFDLGVBQWUsR0FBR0gsK0NBQVFBLENBQUM7SUFDL0MsTUFBTSxDQUFDSSxLQUFLQyxPQUFPLEdBQUdMLCtDQUFRQSxDQUFDO0lBQy9CLE1BQU0sQ0FBQ00sSUFBSUMsTUFBTSxHQUFHUCwrQ0FBUUEsQ0FBQztJQUM3QixNQUFNLENBQUNRLElBQUlDLE1BQU0sR0FBR1QsK0NBQVFBLENBQUM7SUFDN0IsTUFBTSxDQUFDVSxLQUFLQyxPQUFPLEdBQUdYLCtDQUFRQSxDQUFDO0lBQy9CLE1BQU0sQ0FBQ1ksaUJBQWlCQyxtQkFBbUIsR0FBR2IsK0NBQVFBLENBQUM7SUFDdkQsTUFBTSxDQUFDYyxhQUFhQyxlQUFlLEdBQUdmLCtDQUFRQSxDQUFDO0lBRS9DLE1BQU1nQixrQkFBa0I7UUFDdEIsTUFBTUMsWUFBWWYsY0FBZUUsQ0FBQUEsTUFBTSxHQUFFO1FBQ3pDLE1BQU1jLFdBQVdoQixjQUFlTSxDQUFBQSxLQUFLLEdBQUU7UUFFdkMsTUFBTVcsbUJBQ0pqQixjQUFjZSxZQUFZWCxLQUFLWSxXQUFXUixNQUFNRTtRQUNsREcsZUFBZUksaUJBQWlCQyxPQUFPLENBQUM7SUFDMUM7SUFFQSxNQUFNQywwQkFBMEIsU0FBQ0MsT0FBT0MsT0FBT0MsVUFBVUMsS0FBS0MsS0FBS0M7WUFBTUMsd0VBQU87O1FBQzlFLE1BQU0sQ0FBQ0MsYUFBYUMsZUFBZSxHQUFHOUIsK0NBQVFBLENBQUM7UUFFL0MscUJBQ0UsOERBQUNaLGlEQUFHQTtZQUFDMkMsSUFBSTtZQUFHQyxPQUFNOzs4QkFDaEIsOERBQUNwQyxrREFBSUE7b0JBQUNtQyxJQUFJOzhCQUFJVDs7Ozs7OzhCQUNkLDhEQUFDekIsa0RBQUlBO29CQUFDb0MsWUFBVzs7c0NBQ2YsOERBQUMzQyxvREFBTUE7NEJBQ0w0QyxNQUFLOzRCQUNMQyxjQUFjWjs0QkFDZEUsS0FBS0E7NEJBQ0xDLEtBQUtBOzRCQUNMQyxNQUFNQTs0QkFDTkosT0FBT0E7NEJBQ1BhLFVBQVUsQ0FBQ0MsSUFBTWIsU0FBU2E7NEJBQzFCQyxjQUFjLElBQU1SLGVBQWU7NEJBQ25DUyxjQUFjLElBQU1ULGVBQWU7NEJBQ25DVSxhQUFZOzRCQUNaQyxJQUFJOzs4Q0FFSiw4REFBQ2pELHlEQUFXQTs4Q0FDViw0RUFBQ0MsK0RBQWlCQTs7Ozs7Ozs7Ozs4Q0FFcEIsOERBQUNFLHFEQUFPQTtvQ0FDTitDLFFBQVE7b0NBQ1JDLElBQUc7b0NBQ0hDLE9BQU07b0NBQ05DLFdBQVU7b0NBQ1ZDLFFBQVFqQjtvQ0FDUlAsT0FBTyxHQUFXTSxPQUFSTCxPQUFhLE9BQUxLOzhDQUVsQiw0RUFBQ2xDLHlEQUFXQTs7Ozs7Ozs7Ozs7Ozs7OztzQ0FHaEIsOERBQUNJLG1EQUFLQTs0QkFDSmtDLE9BQU07NEJBQ05ULE9BQU9BOzRCQUNQYSxVQUFVLENBQUNXLElBQU12QixTQUFTd0IsV0FBV0QsRUFBRUUsTUFBTSxDQUFDMUIsS0FBSyxLQUFLOzRCQUN4RDJCLE1BQUs7NEJBQ0xDLFdBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUtwQjtRQTVDTTlCO0lBOENOLHFCQUNFLDhEQUFDakMsaURBQUdBO1FBQ0ZnRSxTQUFRO1FBQ1JDLGVBQWM7UUFDZHBCLFlBQVc7UUFDWHFCLGdCQUFlO1FBQ2ZDLEdBQUc7UUFDSFosSUFBRztRQUNIQyxPQUFNO1FBQ05ZLGNBQWE7UUFDYkMsUUFBTztRQUNQekIsT0FBTTtRQUNOMEIsVUFBUztRQUNUQyxJQUFHOzswQkFFSCw4REFBQy9ELGtEQUFJQTtnQkFBQ2dFLFVBQVM7Z0JBQU1DLFlBQVc7Z0JBQU85QixJQUFJO2dCQUFHb0IsV0FBVTswQkFBUzs7Ozs7O1lBSWhFOUIsd0JBQXdCLG9CQUFvQm5CLGFBQWFDLGdCQUFnQixNQUFNLFNBQVMsTUFBTTtZQUM5RmtCLHdCQUF3QixXQUFXakIsS0FBS0MsUUFBUSxHQUFHLEtBQUssS0FBSztZQUM3RGdCLHdCQUF3QixVQUFVZixJQUFJQyxPQUFPLEdBQUcsS0FBSyxLQUFLO1lBQzFEYyx3QkFBd0IsV0FBV1gsS0FBS0MsUUFBUSxHQUFHLFFBQVEsS0FBSztZQUNoRVUsd0JBQXdCLHdCQUF3QlQsaUJBQWlCQyxvQkFBb0IsR0FBRyxPQUFPLEtBQUs7WUFDcEdRLHdCQUF3QixVQUFVYixJQUFJQyxPQUFPLEdBQUcsSUFBSSxLQUFLOzBCQUcxRCw4REFBQ3BCLG9EQUFNQTtnQkFDTHVELE9BQU07Z0JBQ05rQixZQUFXO2dCQUNYQyxTQUFTL0M7Z0JBQ1RnQixPQUFNO2dCQUNORCxJQUFJOzBCQUNMOzs7Ozs7WUFJQWpCLDZCQUNDLDhEQUFDbEIsa0RBQUlBO2dCQUFDZ0UsVUFBUztnQkFBS2hCLE9BQU07Z0JBQVlvQixJQUFJOztvQkFBRztvQkFDM0JsRDs7Ozs7Ozs7Ozs7OztBQUsxQjtHQTVHTWI7S0FBQUE7QUE4R04sK0RBQWVBLGdCQUFnQkEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9zcmMvYXBwL2NvbXBvbmVudHMvU0FMQ2FsLmpzP2UwZGEiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgY2xpZW50XCI7XHJcbmltcG9ydCB7XHJcbiAgQm94LFxyXG4gIEJ1dHRvbixcclxuICBTbGlkZXIsXHJcbiAgU2xpZGVyTWFyayxcclxuICBTbGlkZXJUcmFjayxcclxuICBTbGlkZXJGaWxsZWRUcmFjayxcclxuICBTbGlkZXJUaHVtYixcclxuICBUb29sdGlwLFxyXG4gIFRleHQsXHJcbiAgRmxleCxcclxuICBJbnB1dCxcclxufSBmcm9tIFwiQGNoYWtyYS11aS9yZWFjdFwiO1xyXG5pbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmNvbnN0IFNhbGFyeUNhbGN1bGF0b3IgPSAoKSA9PiB7XHJcbiAgY29uc3QgW2Jhc2ljU2FsYXJ5LCBzZXRCYXNpY1NhbGFyeV0gPSB1c2VTdGF0ZSgxMDAwMCk7XHJcbiAgY29uc3QgW2hyYSwgc2V0SHJhXSA9IHVzZVN0YXRlKDEwKTtcclxuICBjb25zdCBbdGEsIHNldFRhXSA9IHVzZVN0YXRlKDEwKTtcclxuICBjb25zdCBbcGYsIHNldFBmXSA9IHVzZVN0YXRlKDUpO1xyXG4gIGNvbnN0IFt0YXgsIHNldFRheF0gPSB1c2VTdGF0ZSgxMDAwMCk7XHJcbiAgY29uc3QgW290aGVyRGVkdWN0aW9ucywgc2V0T3RoZXJEZWR1Y3Rpb25zXSA9IHVzZVN0YXRlKDUwMCk7XHJcbiAgY29uc3QgW2dyb3NzU2FsYXJ5LCBzZXRHcm9zc1NhbGFyeV0gPSB1c2VTdGF0ZShudWxsKTtcclxuXHJcbiAgY29uc3QgY2FsY3VsYXRlU2FsYXJ5ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgaHJhQW1vdW50ID0gYmFzaWNTYWxhcnkgKiAoaHJhIC8gMTAwKTtcclxuICAgIGNvbnN0IHBmQW1vdW50ID0gYmFzaWNTYWxhcnkgKiAocGYgLyAxMDApO1xyXG5cclxuICAgIGNvbnN0IHRvdGFsR3Jvc3NTYWxhcnkgPVxyXG4gICAgICBiYXNpY1NhbGFyeSArIGhyYUFtb3VudCArIHRhIC0gcGZBbW91bnQgLSB0YXggLSBvdGhlckRlZHVjdGlvbnM7XHJcbiAgICBzZXRHcm9zc1NhbGFyeSh0b3RhbEdyb3NzU2FsYXJ5LnRvRml4ZWQoMikpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHJlbmRlclNsaWRlcldpdGhUZXh0Ym94ID0gKGxhYmVsLCB2YWx1ZSwgc2V0VmFsdWUsIG1pbiwgbWF4LCBzdGVwLCB1bml0ID0gXCJcIikgPT4ge1xyXG4gICAgY29uc3QgW3Nob3dUb29sdGlwLCBzZXRTaG93VG9vbHRpcF0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPEJveCBtYj17Nn0gd2lkdGg9XCIxMDAlXCI+XHJcbiAgICAgICAgPFRleHQgbWI9ezJ9PntsYWJlbH08L1RleHQ+XHJcbiAgICAgICAgPEZsZXggYWxpZ25JdGVtcz1cImNlbnRlclwiPlxyXG4gICAgICAgICAgPFNsaWRlclxyXG4gICAgICAgICAgICBmbGV4PVwiMVwiXHJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dmFsdWV9XHJcbiAgICAgICAgICAgIG1pbj17bWlufVxyXG4gICAgICAgICAgICBtYXg9e21heH1cclxuICAgICAgICAgICAgc3RlcD17c3RlcH1cclxuICAgICAgICAgICAgdmFsdWU9e3ZhbHVlfVxyXG4gICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IHNldFZhbHVlKHYpfVxyXG4gICAgICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHNldFNob3dUb29sdGlwKHRydWUpfVxyXG4gICAgICAgICAgICBvbk1vdXNlTGVhdmU9eygpID0+IHNldFNob3dUb29sdGlwKGZhbHNlKX1cclxuICAgICAgICAgICAgY29sb3JTY2hlbWU9XCJ0ZWFsXCJcclxuICAgICAgICAgICAgbXI9ezR9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIDxTbGlkZXJUcmFjaz5cclxuICAgICAgICAgICAgICA8U2xpZGVyRmlsbGVkVHJhY2sgLz5cclxuICAgICAgICAgICAgPC9TbGlkZXJUcmFjaz5cclxuICAgICAgICAgICAgPFRvb2x0aXBcclxuICAgICAgICAgICAgICBoYXNBcnJvd1xyXG4gICAgICAgICAgICAgIGJnPVwidGVhbC41MDBcIlxyXG4gICAgICAgICAgICAgIGNvbG9yPVwid2hpdGVcIlxyXG4gICAgICAgICAgICAgIHBsYWNlbWVudD1cInRvcFwiXHJcbiAgICAgICAgICAgICAgaXNPcGVuPXtzaG93VG9vbHRpcH1cclxuICAgICAgICAgICAgICBsYWJlbD17YCR7dmFsdWV9JHt1bml0fWB9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8U2xpZGVyVGh1bWIgLz5cclxuICAgICAgICAgICAgPC9Ub29sdGlwPlxyXG4gICAgICAgICAgPC9TbGlkZXI+XHJcbiAgICAgICAgICA8SW5wdXRcclxuICAgICAgICAgICAgd2lkdGg9XCIxMDBweFwiXHJcbiAgICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cclxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRWYWx1ZShwYXJzZUZsb2F0KGUudGFyZ2V0LnZhbHVlKSB8fCAwKX1cclxuICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgIHRleHRBbGlnbj1cImNlbnRlclwiXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvRmxleD5cclxuICAgICAgPC9Cb3g+XHJcbiAgICApO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8Qm94XHJcbiAgICAgIGRpc3BsYXk9XCJmbGV4XCJcclxuICAgICAgZmxleERpcmVjdGlvbj1cImNvbHVtblwiXHJcbiAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxyXG4gICAgICBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiXHJcbiAgICAgIHA9ezZ9XHJcbiAgICAgIGJnPVwicmdiYSgxMTcsIDEyMiwgMTQwLDAuMjk5KVwiXHJcbiAgICAgIGNvbG9yPVwid2hpdGVcIlxyXG4gICAgICBib3JkZXJSYWRpdXM9XCJ4bFwiXHJcbiAgICAgIHNoYWRvdz1cIm1kXCJcclxuICAgICAgd2lkdGg9XCIxMDAlXCJcclxuICAgICAgbWF4V2lkdGg9XCI0MDBweFwiXHJcbiAgICAgIG14PVwiYXV0b1wiXHJcbiAgICA+XHJcbiAgICAgIDxUZXh0IGZvbnRTaXplPVwiMnhsXCIgZm9udFdlaWdodD1cImJvbGRcIiBtYj17Nn0gdGV4dEFsaWduPVwiY2VudGVyXCI+XHJcbiAgICAgICAgU2FsYXJ5IENhbGN1bGF0b3JcclxuICAgICAgPC9UZXh0PlxyXG5cclxuICAgICAge3JlbmRlclNsaWRlcldpdGhUZXh0Ym94KFwiQmFzaWMgU2FsYXJ5ICjigrkpXCIsIGJhc2ljU2FsYXJ5LCBzZXRCYXNpY1NhbGFyeSwgNTAwMCwgMTAwMDAwMCwgMTAwMCwgXCLigrlcIil9XHJcbiAgICAgIHtyZW5kZXJTbGlkZXJXaXRoVGV4dGJveChcIkhSQSAoJSlcIiwgaHJhLCBzZXRIcmEsIDAsIDEwMCwgMC41LCBcIiVcIil9XHJcbiAgICAgIHtyZW5kZXJTbGlkZXJXaXRoVGV4dGJveChcIlRBICglKVwiLCB0YSwgc2V0VGEsIDAsIDEwMCwgMC41LCBcIiVcIil9ICAgXHJcbiAgICAgIHtyZW5kZXJTbGlkZXJXaXRoVGV4dGJveChcIlRheCAo4oK5KVwiLCB0YXgsIHNldFRheCwgMCwgMTAwMDAwLCAxMDAsIFwi4oK5XCIpfVxyXG4gICAgICB7cmVuZGVyU2xpZGVyV2l0aFRleHRib3goXCJPdGhlciBEZWR1Y3Rpb25zICjigrkpXCIsIG90aGVyRGVkdWN0aW9ucywgc2V0T3RoZXJEZWR1Y3Rpb25zLCAwLCAxMDAwMCwgMTAwLCBcIuKCuVwiKX1cclxuICAgICAge3JlbmRlclNsaWRlcldpdGhUZXh0Ym94KFwiUEYgKCUpXCIsIHBmLCBzZXRQZiwgMCwgMjAsIDAuNSwgXCIlXCIpfVxyXG4gICAgICBcclxuXHJcbiAgICAgIDxCdXR0b25cclxuICAgICAgICBjb2xvcj1cIiNlYmVmZjRcIlxyXG4gICAgICAgIGJnR3JhZGllbnQ9XCJsaW5lYXIodG8tciwgIzAwNzVmZiAsICAjOWY3YWVhKVwiXHJcbiAgICAgICAgb25DbGljaz17Y2FsY3VsYXRlU2FsYXJ5fVxyXG4gICAgICAgIHdpZHRoPVwiMTAwJVwiXHJcbiAgICAgICAgbWI9ezR9XHJcbiAgICAgID5cclxuICAgICAgICBDYWxjdWxhdGUgU2FsYXJ5XHJcbiAgICAgIDwvQnV0dG9uPlxyXG5cclxuICAgICAge2dyb3NzU2FsYXJ5ICYmIChcclxuICAgICAgICA8VGV4dCBmb250U2l6ZT1cImxnXCIgY29sb3I9XCJncmVlbi41MDBcIiBtdD17NH0+XHJcbiAgICAgICAgICBHcm9zcyBTYWxhcnk6IOKCuXtncm9zc1NhbGFyeX1cclxuICAgICAgICA8L1RleHQ+XHJcbiAgICAgICl9XHJcbiAgICA8L0JveD5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2FsYXJ5Q2FsY3VsYXRvcjtcclxuIl0sIm5hbWVzIjpbIkJveCIsIkJ1dHRvbiIsIlNsaWRlciIsIlNsaWRlck1hcmsiLCJTbGlkZXJUcmFjayIsIlNsaWRlckZpbGxlZFRyYWNrIiwiU2xpZGVyVGh1bWIiLCJUb29sdGlwIiwiVGV4dCIsIkZsZXgiLCJJbnB1dCIsIlJlYWN0IiwidXNlU3RhdGUiLCJTYWxhcnlDYWxjdWxhdG9yIiwiYmFzaWNTYWxhcnkiLCJzZXRCYXNpY1NhbGFyeSIsImhyYSIsInNldEhyYSIsInRhIiwic2V0VGEiLCJwZiIsInNldFBmIiwidGF4Iiwic2V0VGF4Iiwib3RoZXJEZWR1Y3Rpb25zIiwic2V0T3RoZXJEZWR1Y3Rpb25zIiwiZ3Jvc3NTYWxhcnkiLCJzZXRHcm9zc1NhbGFyeSIsImNhbGN1bGF0ZVNhbGFyeSIsImhyYUFtb3VudCIsInBmQW1vdW50IiwidG90YWxHcm9zc1NhbGFyeSIsInRvRml4ZWQiLCJyZW5kZXJTbGlkZXJXaXRoVGV4dGJveCIsImxhYmVsIiwidmFsdWUiLCJzZXRWYWx1ZSIsIm1pbiIsIm1heCIsInN0ZXAiLCJ1bml0Iiwic2hvd1Rvb2x0aXAiLCJzZXRTaG93VG9vbHRpcCIsIm1iIiwid2lkdGgiLCJhbGlnbkl0ZW1zIiwiZmxleCIsImRlZmF1bHRWYWx1ZSIsIm9uQ2hhbmdlIiwidiIsIm9uTW91c2VFbnRlciIsIm9uTW91c2VMZWF2ZSIsImNvbG9yU2NoZW1lIiwibXIiLCJoYXNBcnJvdyIsImJnIiwiY29sb3IiLCJwbGFjZW1lbnQiLCJpc09wZW4iLCJlIiwicGFyc2VGbG9hdCIsInRhcmdldCIsInR5cGUiLCJ0ZXh0QWxpZ24iLCJkaXNwbGF5IiwiZmxleERpcmVjdGlvbiIsImp1c3RpZnlDb250ZW50IiwicCIsImJvcmRlclJhZGl1cyIsInNoYWRvdyIsIm1heFdpZHRoIiwibXgiLCJmb250U2l6ZSIsImZvbnRXZWlnaHQiLCJiZ0dyYWRpZW50Iiwib25DbGljayIsIm10Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/components/SALCal.js\n"));

/***/ })

});