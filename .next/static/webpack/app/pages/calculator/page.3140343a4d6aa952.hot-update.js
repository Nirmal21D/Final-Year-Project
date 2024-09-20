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

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/layout/dist/chunk-PULVB27S.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/layout/dist/chunk-2OOHT3W5.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/layout/dist/chunk-KRPLQIP4.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/slider/dist/chunk-6KSEUUNN.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/tooltip/dist/chunk-TK6VMDNP.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/input/dist/chunk-6CVSDS6C.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/button/dist/chunk-UVUR7MCU.mjs\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\nconst SalaryCalculator = ()=>{\n    var _this = undefined;\n    _s();\n    var _s1 = $RefreshSig$();\n    const [basicSalary, setBasicSalary] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(10000);\n    const [hra, setHra] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(10);\n    const [ta, setTa] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(10);\n    const [pf, setPf] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(5);\n    const [tax, setTax] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(10000);\n    const [otherDeductions, setOtherDeductions] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(500);\n    const [grossSalary, setGrossSalary] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const calculateSalary = ()=>{\n        const hraAmount = basicSalary * (hra / 100);\n        const pfAmount = basicSalary * (pf / 100);\n        const totalGrossSalary = basicSalary + hraAmount + ta - pfAmount - tax - otherDeductions;\n        setGrossSalary(totalGrossSalary.toFixed(2));\n    };\n    const renderSliderWithTextbox = function(label, value, setValue, min, max, step) {\n        let unit = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : \"\";\n        _s1();\n        const [showTooltip, setShowTooltip] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__.Box, {\n            mb: 6,\n            width: \"100%\",\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__.Text, {\n                    mb: 2,\n                    children: label\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                    lineNumber: 39,\n                    columnNumber: 9\n                }, _this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_4__.Flex, {\n                    alignItems: \"center\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_5__.Slider, {\n                            flex: \"1\",\n                            defaultValue: value,\n                            min: min,\n                            max: max,\n                            step: step,\n                            value: value,\n                            onChange: (v)=>setValue(v),\n                            onMouseEnter: ()=>setShowTooltip(true),\n                            onMouseLeave: ()=>setShowTooltip(false),\n                            colorScheme: \"teal\",\n                            mr: 4,\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_5__.SliderTrack, {\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_5__.SliderFilledTrack, {}, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                                        lineNumber: 55,\n                                        columnNumber: 15\n                                    }, _this)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                                    lineNumber: 54,\n                                    columnNumber: 13\n                                }, _this),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_6__.Tooltip, {\n                                    hasArrow: true,\n                                    bg: \"teal.500\",\n                                    color: \"white\",\n                                    placement: \"top\",\n                                    isOpen: showTooltip,\n                                    label: \"\".concat(value).concat(unit),\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_5__.SliderThumb, {}, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                                        lineNumber: 65,\n                                        columnNumber: 15\n                                    }, _this)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                                    lineNumber: 57,\n                                    columnNumber: 13\n                                }, _this)\n                            ]\n                        }, void 0, true, {\n                            fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                            lineNumber: 41,\n                            columnNumber: 11\n                        }, _this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_7__.Input, {\n                            width: \"100px\",\n                            value: value,\n                            onChange: (e)=>setValue(parseFloat(e.target.value) || 0),\n                            type: \"number\",\n                            textAlign: \"center\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                            lineNumber: 68,\n                            columnNumber: 11\n                        }, _this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                    lineNumber: 40,\n                    columnNumber: 9\n                }, _this)\n            ]\n        }, void 0, true, {\n            fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n            lineNumber: 38,\n            columnNumber: 7\n        }, _this);\n    };\n    _s1(renderSliderWithTextbox, \"MlKqB7CDspaiqeinDL2ipSY+OVU=\");\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__.Box, {\n        display: \"flex\",\n        flexDirection: \"column\",\n        alignItems: \"center\",\n        justifyContent: \"center\",\n        p: 6,\n        bg: \"rgba(117, 122, 140,0.299)\",\n        color: \"white\",\n        borderRadius: \"xl\",\n        shadow: \"md\",\n        width: \"100%\",\n        maxWidth: \"400px\",\n        mx: \"auto\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__.Text, {\n                fontSize: \"2xl\",\n                fontWeight: \"bold\",\n                mb: 6,\n                textAlign: \"center\",\n                children: \"Salary Calculator\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                lineNumber: 95,\n                columnNumber: 7\n            }, undefined),\n            renderSliderWithTextbox(\"Basic Salary (₹)\", basicSalary, setBasicSalary, 5000, 1000000, 1000, \"₹\"),\n            renderSliderWithTextbox(\"HRA (%)\", hra, setHra, 0, 100, 0.5, \"%\"),\n            renderSliderWithTextbox(\"TA (%)\", ta, setTa, 0, 100, 0.5, \"%\"),\n            renderSliderWithTextbox(\"Tax (₹)\", tax, setTax, 0, 100000, 1000, \"₹\"),\n            renderSliderWithTextbox(\"Other Deductions (₹)\", otherDeductions, setOtherDeductions, 0, 100000, 1000, \"₹\"),\n            renderSliderWithTextbox(\"PF (%)\", pf, setPf, 0, 100, 0.1, \"%\"),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_8__.Button, {\n                color: \"#ebeff4\",\n                bgGradient: \"linear(to-r, #0075ff ,  #9f7aea)\",\n                onClick: calculateSalary,\n                width: \"100%\",\n                mb: 4,\n                children: \"Calculate Salary\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                lineNumber: 107,\n                columnNumber: 7\n            }, undefined),\n            grossSalary && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__.Text, {\n                fontSize: \"lg\",\n                color: \"green.500\",\n                mt: 4,\n                children: [\n                    \"Gross Salary: ₹\",\n                    grossSalary\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n                lineNumber: 118,\n                columnNumber: 9\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SALCal.js\",\n        lineNumber: 81,\n        columnNumber: 5\n    }, undefined);\n};\n_s(SalaryCalculator, \"uL5CZ3Dx74e1+yYfLxuA9ZBLFqU=\");\n_c = SalaryCalculator;\n/* harmony default export */ __webpack_exports__[\"default\"] = (SalaryCalculator);\nvar _c;\n$RefreshReg$(_c, \"SalaryCalculator\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvY29tcG9uZW50cy9TQUxDYWwuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQVkwQjtBQUNjO0FBRXhDLE1BQU1ZLG1CQUFtQjs7OztJQUN2QixNQUFNLENBQUNDLGFBQWFDLGVBQWUsR0FBR0gsK0NBQVFBLENBQUM7SUFDL0MsTUFBTSxDQUFDSSxLQUFLQyxPQUFPLEdBQUdMLCtDQUFRQSxDQUFDO0lBQy9CLE1BQU0sQ0FBQ00sSUFBSUMsTUFBTSxHQUFHUCwrQ0FBUUEsQ0FBQztJQUM3QixNQUFNLENBQUNRLElBQUlDLE1BQU0sR0FBR1QsK0NBQVFBLENBQUM7SUFDN0IsTUFBTSxDQUFDVSxLQUFLQyxPQUFPLEdBQUdYLCtDQUFRQSxDQUFDO0lBQy9CLE1BQU0sQ0FBQ1ksaUJBQWlCQyxtQkFBbUIsR0FBR2IsK0NBQVFBLENBQUM7SUFDdkQsTUFBTSxDQUFDYyxhQUFhQyxlQUFlLEdBQUdmLCtDQUFRQSxDQUFDO0lBRS9DLE1BQU1nQixrQkFBa0I7UUFDdEIsTUFBTUMsWUFBWWYsY0FBZUUsQ0FBQUEsTUFBTSxHQUFFO1FBQ3pDLE1BQU1jLFdBQVdoQixjQUFlTSxDQUFBQSxLQUFLLEdBQUU7UUFFdkMsTUFBTVcsbUJBQ0pqQixjQUFjZSxZQUFZWCxLQUFLWSxXQUFXUixNQUFNRTtRQUNsREcsZUFBZUksaUJBQWlCQyxPQUFPLENBQUM7SUFDMUM7SUFFQSxNQUFNQywwQkFBMEIsU0FBQ0MsT0FBT0MsT0FBT0MsVUFBVUMsS0FBS0MsS0FBS0M7WUFBTUMsd0VBQU87O1FBQzlFLE1BQU0sQ0FBQ0MsYUFBYUMsZUFBZSxHQUFHOUIsK0NBQVFBLENBQUM7UUFFL0MscUJBQ0UsOERBQUNYLGlEQUFHQTtZQUFDMEMsSUFBSTtZQUFHQyxPQUFNOzs4QkFDaEIsOERBQUNwQyxrREFBSUE7b0JBQUNtQyxJQUFJOzhCQUFJVDs7Ozs7OzhCQUNkLDhEQUFDekIsa0RBQUlBO29CQUFDb0MsWUFBVzs7c0NBQ2YsOERBQUMxQyxvREFBTUE7NEJBQ0wyQyxNQUFLOzRCQUNMQyxjQUFjWjs0QkFDZEUsS0FBS0E7NEJBQ0xDLEtBQUtBOzRCQUNMQyxNQUFNQTs0QkFDTkosT0FBT0E7NEJBQ1BhLFVBQVUsQ0FBQ0MsSUFBTWIsU0FBU2E7NEJBQzFCQyxjQUFjLElBQU1SLGVBQWU7NEJBQ25DUyxjQUFjLElBQU1ULGVBQWU7NEJBQ25DVSxhQUFZOzRCQUNaQyxJQUFJOzs4Q0FFSiw4REFBQ2pELHlEQUFXQTs4Q0FDViw0RUFBQ0MsK0RBQWlCQTs7Ozs7Ozs7Ozs4Q0FFcEIsOERBQUNFLHFEQUFPQTtvQ0FDTitDLFFBQVE7b0NBQ1JDLElBQUc7b0NBQ0hDLE9BQU07b0NBQ05DLFdBQVU7b0NBQ1ZDLFFBQVFqQjtvQ0FDUlAsT0FBTyxHQUFXTSxPQUFSTCxPQUFhLE9BQUxLOzhDQUVsQiw0RUFBQ2xDLHlEQUFXQTs7Ozs7Ozs7Ozs7Ozs7OztzQ0FHaEIsOERBQUNJLG1EQUFLQTs0QkFDSmtDLE9BQU07NEJBQ05ULE9BQU9BOzRCQUNQYSxVQUFVLENBQUNXLElBQU12QixTQUFTd0IsV0FBV0QsRUFBRUUsTUFBTSxDQUFDMUIsS0FBSyxLQUFLOzRCQUN4RDJCLE1BQUs7NEJBQ0xDLFdBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUtwQjtRQTVDTTlCO0lBOENOLHFCQUNFLDhEQUFDaEMsaURBQUdBO1FBQ0YrRCxTQUFRO1FBQ1JDLGVBQWM7UUFDZHBCLFlBQVc7UUFDWHFCLGdCQUFlO1FBQ2ZDLEdBQUc7UUFDSFosSUFBRztRQUNIQyxPQUFNO1FBQ05ZLGNBQWE7UUFDYkMsUUFBTztRQUNQekIsT0FBTTtRQUNOMEIsVUFBUztRQUNUQyxJQUFHOzswQkFFSCw4REFBQy9ELGtEQUFJQTtnQkFBQ2dFLFVBQVM7Z0JBQU1DLFlBQVc7Z0JBQU85QixJQUFJO2dCQUFHb0IsV0FBVTswQkFBUzs7Ozs7O1lBSWhFOUIsd0JBQXdCLG9CQUFvQm5CLGFBQWFDLGdCQUFnQixNQUFNLFNBQVMsTUFBTTtZQUM5RmtCLHdCQUF3QixXQUFXakIsS0FBS0MsUUFBUSxHQUFHLEtBQUssS0FBSztZQUM3RGdCLHdCQUF3QixVQUFVZixJQUFJQyxPQUFPLEdBQUcsS0FBSyxLQUFLO1lBQzFEYyx3QkFBd0IsV0FBV1gsS0FBS0MsUUFBUSxHQUFHLFFBQVEsTUFBTTtZQUNqRVUsd0JBQXdCLHdCQUF3QlQsaUJBQWlCQyxvQkFBb0IsR0FBRyxRQUFRLE1BQU07WUFDdEdRLHdCQUF3QixVQUFVYixJQUFJQyxPQUFPLEdBQUcsS0FBSyxLQUFLOzBCQUczRCw4REFBQ25CLG9EQUFNQTtnQkFDTHNELE9BQU07Z0JBQ05rQixZQUFXO2dCQUNYQyxTQUFTL0M7Z0JBQ1RnQixPQUFNO2dCQUNORCxJQUFJOzBCQUNMOzs7Ozs7WUFJQWpCLDZCQUNDLDhEQUFDbEIsa0RBQUlBO2dCQUFDZ0UsVUFBUztnQkFBS2hCLE9BQU07Z0JBQVlvQixJQUFJOztvQkFBRztvQkFDM0JsRDs7Ozs7Ozs7Ozs7OztBQUsxQjtHQTVHTWI7S0FBQUE7QUE4R04sK0RBQWVBLGdCQUFnQkEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9zcmMvYXBwL2NvbXBvbmVudHMvU0FMQ2FsLmpzP2UwZGEiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgY2xpZW50XCI7XHJcbmltcG9ydCB7XHJcbiAgQm94LFxyXG4gIEJ1dHRvbixcclxuICBTbGlkZXIsXHJcbiAgU2xpZGVyVHJhY2ssXHJcbiAgU2xpZGVyRmlsbGVkVHJhY2ssXHJcbiAgU2xpZGVyVGh1bWIsXHJcbiAgVG9vbHRpcCxcclxuICBUZXh0LFxyXG4gIEZsZXgsXHJcbiAgSW5wdXQsXHJcbn0gZnJvbSBcIkBjaGFrcmEtdWkvcmVhY3RcIjtcclxuaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBTYWxhcnlDYWxjdWxhdG9yID0gKCkgPT4ge1xyXG4gIGNvbnN0IFtiYXNpY1NhbGFyeSwgc2V0QmFzaWNTYWxhcnldID0gdXNlU3RhdGUoMTAwMDApO1xyXG4gIGNvbnN0IFtocmEsIHNldEhyYV0gPSB1c2VTdGF0ZSgxMCk7XHJcbiAgY29uc3QgW3RhLCBzZXRUYV0gPSB1c2VTdGF0ZSgxMCk7XHJcbiAgY29uc3QgW3BmLCBzZXRQZl0gPSB1c2VTdGF0ZSg1KTtcclxuICBjb25zdCBbdGF4LCBzZXRUYXhdID0gdXNlU3RhdGUoMTAwMDApO1xyXG4gIGNvbnN0IFtvdGhlckRlZHVjdGlvbnMsIHNldE90aGVyRGVkdWN0aW9uc10gPSB1c2VTdGF0ZSg1MDApO1xyXG4gIGNvbnN0IFtncm9zc1NhbGFyeSwgc2V0R3Jvc3NTYWxhcnldID0gdXNlU3RhdGUobnVsbCk7XHJcblxyXG4gIGNvbnN0IGNhbGN1bGF0ZVNhbGFyeSA9ICgpID0+IHtcclxuICAgIGNvbnN0IGhyYUFtb3VudCA9IGJhc2ljU2FsYXJ5ICogKGhyYSAvIDEwMCk7XHJcbiAgICBjb25zdCBwZkFtb3VudCA9IGJhc2ljU2FsYXJ5ICogKHBmIC8gMTAwKTtcclxuXHJcbiAgICBjb25zdCB0b3RhbEdyb3NzU2FsYXJ5ID1cclxuICAgICAgYmFzaWNTYWxhcnkgKyBocmFBbW91bnQgKyB0YSAtIHBmQW1vdW50IC0gdGF4IC0gb3RoZXJEZWR1Y3Rpb25zO1xyXG4gICAgc2V0R3Jvc3NTYWxhcnkodG90YWxHcm9zc1NhbGFyeS50b0ZpeGVkKDIpKTtcclxuICB9O1xyXG5cclxuICBjb25zdCByZW5kZXJTbGlkZXJXaXRoVGV4dGJveCA9IChsYWJlbCwgdmFsdWUsIHNldFZhbHVlLCBtaW4sIG1heCwgc3RlcCwgdW5pdCA9IFwiXCIpID0+IHtcclxuICAgIGNvbnN0IFtzaG93VG9vbHRpcCwgc2V0U2hvd1Rvb2x0aXBdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxCb3ggbWI9ezZ9IHdpZHRoPVwiMTAwJVwiPlxyXG4gICAgICAgIDxUZXh0IG1iPXsyfT57bGFiZWx9PC9UZXh0PlxyXG4gICAgICAgIDxGbGV4IGFsaWduSXRlbXM9XCJjZW50ZXJcIj5cclxuICAgICAgICAgIDxTbGlkZXJcclxuICAgICAgICAgICAgZmxleD1cIjFcIlxyXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3ZhbHVlfVxyXG4gICAgICAgICAgICBtaW49e21pbn1cclxuICAgICAgICAgICAgbWF4PXttYXh9XHJcbiAgICAgICAgICAgIHN0ZXA9e3N0ZXB9XHJcbiAgICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cclxuICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiBzZXRWYWx1ZSh2KX1cclxuICAgICAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiBzZXRTaG93VG9vbHRpcCh0cnVlKX1cclxuICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRTaG93VG9vbHRpcChmYWxzZSl9XHJcbiAgICAgICAgICAgIGNvbG9yU2NoZW1lPVwidGVhbFwiXHJcbiAgICAgICAgICAgIG1yPXs0fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICA8U2xpZGVyVHJhY2s+XHJcbiAgICAgICAgICAgICAgPFNsaWRlckZpbGxlZFRyYWNrIC8+XHJcbiAgICAgICAgICAgIDwvU2xpZGVyVHJhY2s+XHJcbiAgICAgICAgICAgIDxUb29sdGlwXHJcbiAgICAgICAgICAgICAgaGFzQXJyb3dcclxuICAgICAgICAgICAgICBiZz1cInRlYWwuNTAwXCJcclxuICAgICAgICAgICAgICBjb2xvcj1cIndoaXRlXCJcclxuICAgICAgICAgICAgICBwbGFjZW1lbnQ9XCJ0b3BcIlxyXG4gICAgICAgICAgICAgIGlzT3Blbj17c2hvd1Rvb2x0aXB9XHJcbiAgICAgICAgICAgICAgbGFiZWw9e2Ake3ZhbHVlfSR7dW5pdH1gfVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgPFNsaWRlclRodW1iIC8+XHJcbiAgICAgICAgICAgIDwvVG9vbHRpcD5cclxuICAgICAgICAgIDwvU2xpZGVyPlxyXG4gICAgICAgICAgPElucHV0XHJcbiAgICAgICAgICAgIHdpZHRoPVwiMTAwcHhcIlxyXG4gICAgICAgICAgICB2YWx1ZT17dmFsdWV9XHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0VmFsdWUocGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSkgfHwgMCl9XHJcbiAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICB0ZXh0QWxpZ249XCJjZW50ZXJcIlxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L0ZsZXg+XHJcbiAgICAgIDwvQm94PlxyXG4gICAgKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPEJveFxyXG4gICAgICBkaXNwbGF5PVwiZmxleFwiXHJcbiAgICAgIGZsZXhEaXJlY3Rpb249XCJjb2x1bW5cIlxyXG4gICAgICBhbGlnbkl0ZW1zPVwiY2VudGVyXCJcclxuICAgICAganVzdGlmeUNvbnRlbnQ9XCJjZW50ZXJcIlxyXG4gICAgICBwPXs2fVxyXG4gICAgICBiZz1cInJnYmEoMTE3LCAxMjIsIDE0MCwwLjI5OSlcIlxyXG4gICAgICBjb2xvcj1cIndoaXRlXCJcclxuICAgICAgYm9yZGVyUmFkaXVzPVwieGxcIlxyXG4gICAgICBzaGFkb3c9XCJtZFwiXHJcbiAgICAgIHdpZHRoPVwiMTAwJVwiXHJcbiAgICAgIG1heFdpZHRoPVwiNDAwcHhcIlxyXG4gICAgICBteD1cImF1dG9cIlxyXG4gICAgPlxyXG4gICAgICA8VGV4dCBmb250U2l6ZT1cIjJ4bFwiIGZvbnRXZWlnaHQ9XCJib2xkXCIgbWI9ezZ9IHRleHRBbGlnbj1cImNlbnRlclwiPlxyXG4gICAgICAgIFNhbGFyeSBDYWxjdWxhdG9yXHJcbiAgICAgIDwvVGV4dD5cclxuXHJcbiAgICAgIHtyZW5kZXJTbGlkZXJXaXRoVGV4dGJveChcIkJhc2ljIFNhbGFyeSAo4oK5KVwiLCBiYXNpY1NhbGFyeSwgc2V0QmFzaWNTYWxhcnksIDUwMDAsIDEwMDAwMDAsIDEwMDAsIFwi4oK5XCIpfVxyXG4gICAgICB7cmVuZGVyU2xpZGVyV2l0aFRleHRib3goXCJIUkEgKCUpXCIsIGhyYSwgc2V0SHJhLCAwLCAxMDAsIDAuNSwgXCIlXCIpfVxyXG4gICAgICB7cmVuZGVyU2xpZGVyV2l0aFRleHRib3goXCJUQSAoJSlcIiwgdGEsIHNldFRhLCAwLCAxMDAsIDAuNSwgXCIlXCIpfSAgIFxyXG4gICAgICB7cmVuZGVyU2xpZGVyV2l0aFRleHRib3goXCJUYXggKOKCuSlcIiwgdGF4LCBzZXRUYXgsIDAsIDEwMDAwMCwgMTAwMCwgXCLigrlcIil9XHJcbiAgICAgIHtyZW5kZXJTbGlkZXJXaXRoVGV4dGJveChcIk90aGVyIERlZHVjdGlvbnMgKOKCuSlcIiwgb3RoZXJEZWR1Y3Rpb25zLCBzZXRPdGhlckRlZHVjdGlvbnMsIDAsIDEwMDAwMCwgMTAwMCwgXCLigrlcIil9XHJcbiAgICAgIHtyZW5kZXJTbGlkZXJXaXRoVGV4dGJveChcIlBGICglKVwiLCBwZiwgc2V0UGYsIDAsIDEwMCwgMC4xLCBcIiVcIil9XHJcbiAgICAgIFxyXG5cclxuICAgICAgPEJ1dHRvblxyXG4gICAgICAgIGNvbG9yPVwiI2ViZWZmNFwiXHJcbiAgICAgICAgYmdHcmFkaWVudD1cImxpbmVhcih0by1yLCAjMDA3NWZmICwgICM5ZjdhZWEpXCJcclxuICAgICAgICBvbkNsaWNrPXtjYWxjdWxhdGVTYWxhcnl9XHJcbiAgICAgICAgd2lkdGg9XCIxMDAlXCJcclxuICAgICAgICBtYj17NH1cclxuICAgICAgPlxyXG4gICAgICAgIENhbGN1bGF0ZSBTYWxhcnlcclxuICAgICAgPC9CdXR0b24+XHJcblxyXG4gICAgICB7Z3Jvc3NTYWxhcnkgJiYgKFxyXG4gICAgICAgIDxUZXh0IGZvbnRTaXplPVwibGdcIiBjb2xvcj1cImdyZWVuLjUwMFwiIG10PXs0fT5cclxuICAgICAgICAgIEdyb3NzIFNhbGFyeTog4oK5e2dyb3NzU2FsYXJ5fVxyXG4gICAgICAgIDwvVGV4dD5cclxuICAgICAgKX1cclxuICAgIDwvQm94PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTYWxhcnlDYWxjdWxhdG9yO1xyXG4iXSwibmFtZXMiOlsiQm94IiwiQnV0dG9uIiwiU2xpZGVyIiwiU2xpZGVyVHJhY2siLCJTbGlkZXJGaWxsZWRUcmFjayIsIlNsaWRlclRodW1iIiwiVG9vbHRpcCIsIlRleHQiLCJGbGV4IiwiSW5wdXQiLCJSZWFjdCIsInVzZVN0YXRlIiwiU2FsYXJ5Q2FsY3VsYXRvciIsImJhc2ljU2FsYXJ5Iiwic2V0QmFzaWNTYWxhcnkiLCJocmEiLCJzZXRIcmEiLCJ0YSIsInNldFRhIiwicGYiLCJzZXRQZiIsInRheCIsInNldFRheCIsIm90aGVyRGVkdWN0aW9ucyIsInNldE90aGVyRGVkdWN0aW9ucyIsImdyb3NzU2FsYXJ5Iiwic2V0R3Jvc3NTYWxhcnkiLCJjYWxjdWxhdGVTYWxhcnkiLCJocmFBbW91bnQiLCJwZkFtb3VudCIsInRvdGFsR3Jvc3NTYWxhcnkiLCJ0b0ZpeGVkIiwicmVuZGVyU2xpZGVyV2l0aFRleHRib3giLCJsYWJlbCIsInZhbHVlIiwic2V0VmFsdWUiLCJtaW4iLCJtYXgiLCJzdGVwIiwidW5pdCIsInNob3dUb29sdGlwIiwic2V0U2hvd1Rvb2x0aXAiLCJtYiIsIndpZHRoIiwiYWxpZ25JdGVtcyIsImZsZXgiLCJkZWZhdWx0VmFsdWUiLCJvbkNoYW5nZSIsInYiLCJvbk1vdXNlRW50ZXIiLCJvbk1vdXNlTGVhdmUiLCJjb2xvclNjaGVtZSIsIm1yIiwiaGFzQXJyb3ciLCJiZyIsImNvbG9yIiwicGxhY2VtZW50IiwiaXNPcGVuIiwiZSIsInBhcnNlRmxvYXQiLCJ0YXJnZXQiLCJ0eXBlIiwidGV4dEFsaWduIiwiZGlzcGxheSIsImZsZXhEaXJlY3Rpb24iLCJqdXN0aWZ5Q29udGVudCIsInAiLCJib3JkZXJSYWRpdXMiLCJzaGFkb3ciLCJtYXhXaWR0aCIsIm14IiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwiYmdHcmFkaWVudCIsIm9uQ2xpY2siLCJtdCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/components/SALCal.js\n"));

/***/ })

});