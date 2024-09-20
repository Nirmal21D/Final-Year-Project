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

/***/ "(app-pages-browser)/./src/app/components/SIPCal.js":
/*!**************************************!*\
  !*** ./src/app/components/SIPCal.js ***!
  \**************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/layout/dist/chunk-PULVB27S.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/layout/dist/chunk-2OOHT3W5.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/layout/dist/chunk-KRPLQIP4.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/slider/dist/chunk-6KSEUUNN.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/tooltip/dist/chunk-TK6VMDNP.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/input/dist/chunk-6CVSDS6C.mjs\");\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @chakra-ui/react */ \"(app-pages-browser)/./node_modules/@chakra-ui/button/dist/chunk-UVUR7MCU.mjs\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\nconst SIPCalculator = ()=>{\n    var _this = undefined;\n    _s();\n    var _s1 = $RefreshSig$();\n    const [installment, setInstallment] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1000); // Monthly SIP amount\n    const [rate, setRate] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(5); // Annual interest rate\n    const [months, setMonths] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(12); // Investment duration in months\n    const [sipValue, setSipValue] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const calculateSIP = ()=>{\n        const monthlyRate = rate / 100 / 12; // Convert annual rate to monthly and decimal\n        const totalAmount = installment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);\n        setSipValue(totalAmount.toFixed(2));\n    };\n    const renderSliderWithTextbox = function(label, value, setValue, min, max, step) {\n        let unit = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : \"\";\n        _s1();\n        const [showTooltip, setShowTooltip] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__.Box, {\n            mb: 6,\n            width: \"100%\",\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__.Text, {\n                    mb: 2,\n                    children: label\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SIPCal.js\",\n                    lineNumber: 38,\n                    columnNumber: 9\n                }, _this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_4__.Flex, {\n                    alignItems: \"center\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_5__.Slider, {\n                            flex: \"1\",\n                            defaultValue: value,\n                            min: min,\n                            max: max,\n                            step: step,\n                            value: value,\n                            onChange: (v)=>setValue(v),\n                            onMouseEnter: ()=>setShowTooltip(true),\n                            onMouseLeave: ()=>setShowTooltip(false),\n                            colorScheme: \"teal\",\n                            mr: 4,\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_5__.SliderTrack, {\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_5__.SliderFilledTrack, {}, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SIPCal.js\",\n                                        lineNumber: 54,\n                                        columnNumber: 15\n                                    }, _this)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SIPCal.js\",\n                                    lineNumber: 53,\n                                    columnNumber: 13\n                                }, _this),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_6__.Tooltip, {\n                                    hasArrow: true,\n                                    bg: \"teal.500\",\n                                    color: \"white\",\n                                    placement: \"top\",\n                                    isOpen: showTooltip,\n                                    label: \"\".concat(value).concat(unit),\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_5__.SliderThumb, {}, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SIPCal.js\",\n                                        lineNumber: 64,\n                                        columnNumber: 15\n                                    }, _this)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SIPCal.js\",\n                                    lineNumber: 56,\n                                    columnNumber: 13\n                                }, _this)\n                            ]\n                        }, void 0, true, {\n                            fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SIPCal.js\",\n                            lineNumber: 40,\n                            columnNumber: 11\n                        }, _this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_7__.Input, {\n                            width: \"100px\",\n                            value: value,\n                            onChange: (e)=>setValue(parseFloat(e.target.value) || 0),\n                            type: \"number\",\n                            textAlign: \"center\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SIPCal.js\",\n                            lineNumber: 67,\n                            columnNumber: 11\n                        }, _this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SIPCal.js\",\n                    lineNumber: 39,\n                    columnNumber: 9\n                }, _this)\n            ]\n        }, void 0, true, {\n            fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SIPCal.js\",\n            lineNumber: 37,\n            columnNumber: 7\n        }, _this);\n    };\n    _s1(renderSliderWithTextbox, \"MlKqB7CDspaiqeinDL2ipSY+OVU=\");\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__.Box, {\n        display: \"flex\",\n        flexDirection: \"column\",\n        alignItems: \"center\",\n        justifyContent: \"center\",\n        p: 6,\n        bg: \"rgba(117, 122, 140,0.299)\",\n        color: \"white\",\n        borderRadius: \"xl\",\n        shadow: \"md\",\n        width: \"100%\",\n        maxWidth: \"400px\",\n        mx: \"auto\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__.Text, {\n                fontSize: \"2xl\",\n                fontWeight: \"bold\",\n                mb: 6,\n                textAlign: \"center\",\n                children: \"SIP Calculator\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SIPCal.js\",\n                lineNumber: 94,\n                columnNumber: 7\n            }, undefined),\n            renderSliderWithTextbox(\"Monthly Installment (₹)\", installment, setInstallment, 500, 50000, 100, \"₹\"),\n            renderSliderWithTextbox(\"Annual Interest Rate (%)\", rate, setRate, 1, 20, 0.5, \"%\"),\n            renderSliderWithTextbox(\"Time Period (Months)\", months, setMonths, 6, 360, 6),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_8__.Button, {\n                color: \"#ebeff4\",\n                bgGradient: \"linear(to-r, #0075ff ,  #9f7aea)\",\n                onClick: calculateSIP,\n                width: \"100%\",\n                mb: 4,\n                children: \"Calculate SIP\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SIPCal.js\",\n                lineNumber: 118,\n                columnNumber: 7\n            }, undefined),\n            sipValue && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__.Text, {\n                fontSize: \"lg\",\n                color: \"green.500\",\n                mt: 4,\n                children: [\n                    \"Future Value: ₹\",\n                    sipValue\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SIPCal.js\",\n                lineNumber: 129,\n                columnNumber: 9\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\rajbh\\\\OneDrive\\\\Desktop\\\\Finance-Mastery\\\\src\\\\app\\\\components\\\\SIPCal.js\",\n        lineNumber: 80,\n        columnNumber: 5\n    }, undefined);\n};\n_s(SIPCalculator, \"9bLiNLsIJdH0w7GF+HBdMndI+jY=\");\n_c = SIPCalculator;\n/* harmony default export */ __webpack_exports__[\"default\"] = (SIPCalculator);\nvar _c;\n$RefreshReg$(_c, \"SIPCalculator\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvY29tcG9uZW50cy9TSVBDYWwuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQWEwQjtBQUNjO0FBRXhDLE1BQU1hLGdCQUFnQjs7OztJQUNwQixNQUFNLENBQUNDLGFBQWFDLGVBQWUsR0FBR0gsK0NBQVFBLENBQUMsT0FBTyxxQkFBcUI7SUFDM0UsTUFBTSxDQUFDSSxNQUFNQyxRQUFRLEdBQUdMLCtDQUFRQSxDQUFDLElBQUksdUJBQXVCO0lBQzVELE1BQU0sQ0FBQ00sUUFBUUMsVUFBVSxHQUFHUCwrQ0FBUUEsQ0FBQyxLQUFLLGdDQUFnQztJQUMxRSxNQUFNLENBQUNRLFVBQVVDLFlBQVksR0FBR1QsK0NBQVFBLENBQUM7SUFFekMsTUFBTVUsZUFBZTtRQUNuQixNQUFNQyxjQUFjUCxPQUFPLE1BQU0sSUFBSSw2Q0FBNkM7UUFDbEYsTUFBTVEsY0FDSlYsY0FDQyxFQUFDVyxLQUFLQyxHQUFHLENBQUMsSUFBSUgsYUFBYUwsVUFBVSxLQUFLSyxXQUFVLElBQ3BELEtBQUlBLFdBQVU7UUFFakJGLFlBQVlHLFlBQVlHLE9BQU8sQ0FBQztJQUNsQztJQUVBLE1BQU1DLDBCQUEwQixTQUFDQyxPQUFPQyxPQUFPQyxVQUFVQyxLQUFLQyxLQUFLQztZQUFNQyx3RUFBTzs7UUFDOUUsTUFBTSxDQUFDQyxhQUFhQyxlQUFlLEdBQUd6QiwrQ0FBUUEsQ0FBQztRQUUvQyxxQkFDRSw4REFBQ1osaURBQUdBO1lBQUNzQyxJQUFJO1lBQUdDLE9BQU07OzhCQUNoQiw4REFBQy9CLGtEQUFJQTtvQkFBQzhCLElBQUk7OEJBQUlUOzs7Ozs7OEJBQ2QsOERBQUNwQixrREFBSUE7b0JBQUMrQixZQUFXOztzQ0FDZiw4REFBQ3RDLG9EQUFNQTs0QkFDTHVDLE1BQUs7NEJBQ0xDLGNBQWNaOzRCQUNkRSxLQUFLQTs0QkFDTEMsS0FBS0E7NEJBQ0xDLE1BQU1BOzRCQUNOSixPQUFPQTs0QkFDUGEsVUFBVSxDQUFDQyxJQUFNYixTQUFTYTs0QkFDMUJDLGNBQWMsSUFBTVIsZUFBZTs0QkFDbkNTLGNBQWMsSUFBTVQsZUFBZTs0QkFDbkNVLGFBQVk7NEJBQ1pDLElBQUk7OzhDQUVKLDhEQUFDNUMseURBQVdBOzhDQUNWLDRFQUFDQywrREFBaUJBOzs7Ozs7Ozs7OzhDQUVwQiw4REFBQ0UscURBQU9BO29DQUNOMEMsUUFBUTtvQ0FDUkMsSUFBRztvQ0FDSEMsT0FBTTtvQ0FDTkMsV0FBVTtvQ0FDVkMsUUFBUWpCO29DQUNSUCxPQUFPLEdBQVdNLE9BQVJMLE9BQWEsT0FBTEs7OENBRWxCLDRFQUFDN0IseURBQVdBOzs7Ozs7Ozs7Ozs7Ozs7O3NDQUdoQiw4REFBQ0ksbURBQUtBOzRCQUNKNkIsT0FBTTs0QkFDTlQsT0FBT0E7NEJBQ1BhLFVBQVUsQ0FBQ1csSUFBTXZCLFNBQVN3QixXQUFXRCxFQUFFRSxNQUFNLENBQUMxQixLQUFLLEtBQUs7NEJBQ3hEMkIsTUFBSzs0QkFDTEMsV0FBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBS3BCO1FBNUNNOUI7SUE4Q04scUJBQ0UsOERBQUM1QixpREFBR0E7UUFDRjJELFNBQVE7UUFDUkMsZUFBYztRQUNkcEIsWUFBVztRQUNYcUIsZ0JBQWU7UUFDZkMsR0FBRztRQUNIWixJQUFHO1FBQ0hDLE9BQU07UUFDTlksY0FBYTtRQUNiQyxRQUFPO1FBQ1B6QixPQUFNO1FBQ04wQixVQUFTO1FBQ1RDLElBQUc7OzBCQUVILDhEQUFDMUQsa0RBQUlBO2dCQUFDMkQsVUFBUztnQkFBTUMsWUFBVztnQkFBTzlCLElBQUk7Z0JBQUdvQixXQUFVOzBCQUFTOzs7Ozs7WUFJaEU5Qix3QkFDQywyQkFDQWQsYUFDQUMsZ0JBQ0EsS0FDQSxPQUNBLEtBQ0E7WUFFRGEsd0JBQ0MsNEJBQ0FaLE1BQ0FDLFNBQ0EsR0FDQSxJQUNBLEtBQ0E7WUFFRFcsd0JBQXdCLHdCQUF3QlYsUUFBUUMsV0FBVyxHQUFHLEtBQUs7MEJBRTVFLDhEQUFDbEIsb0RBQU1BO2dCQUNMa0QsT0FBTTtnQkFDTmtCLFlBQVc7Z0JBQ1hDLFNBQVNoRDtnQkFDVGlCLE9BQU07Z0JBQ05ELElBQUk7MEJBQ0w7Ozs7OztZQUlBbEIsMEJBQ0MsOERBQUNaLGtEQUFJQTtnQkFBQzJELFVBQVM7Z0JBQUtoQixPQUFNO2dCQUFZb0IsSUFBSTs7b0JBQUc7b0JBQzNCbkQ7Ozs7Ozs7Ozs7Ozs7QUFLMUI7R0F0SE1QO0tBQUFBO0FBd0hOLCtEQUFlQSxhQUFhQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy9hcHAvY29tcG9uZW50cy9TSVBDYWwuanM/NTkzNSJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBjbGllbnRcIjtcclxuaW1wb3J0IHtcclxuICBCb3gsXHJcbiAgQnV0dG9uLFxyXG4gIFNsaWRlcixcclxuICBTbGlkZXJNYXJrLFxyXG4gIFNsaWRlclRyYWNrLFxyXG4gIFNsaWRlckZpbGxlZFRyYWNrLFxyXG4gIFNsaWRlclRodW1iLFxyXG4gIFRvb2x0aXAsXHJcbiAgVGV4dCxcclxuICBGbGV4LFxyXG4gIElucHV0LFxyXG59IGZyb20gXCJAY2hha3JhLXVpL3JlYWN0XCI7XHJcbmltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuY29uc3QgU0lQQ2FsY3VsYXRvciA9ICgpID0+IHtcclxuICBjb25zdCBbaW5zdGFsbG1lbnQsIHNldEluc3RhbGxtZW50XSA9IHVzZVN0YXRlKDEwMDApOyAvLyBNb250aGx5IFNJUCBhbW91bnRcclxuICBjb25zdCBbcmF0ZSwgc2V0UmF0ZV0gPSB1c2VTdGF0ZSg1KTsgLy8gQW5udWFsIGludGVyZXN0IHJhdGVcclxuICBjb25zdCBbbW9udGhzLCBzZXRNb250aHNdID0gdXNlU3RhdGUoMTIpOyAvLyBJbnZlc3RtZW50IGR1cmF0aW9uIGluIG1vbnRoc1xyXG4gIGNvbnN0IFtzaXBWYWx1ZSwgc2V0U2lwVmFsdWVdID0gdXNlU3RhdGUobnVsbCk7XHJcblxyXG4gIGNvbnN0IGNhbGN1bGF0ZVNJUCA9ICgpID0+IHtcclxuICAgIGNvbnN0IG1vbnRobHlSYXRlID0gcmF0ZSAvIDEwMCAvIDEyOyAvLyBDb252ZXJ0IGFubnVhbCByYXRlIHRvIG1vbnRobHkgYW5kIGRlY2ltYWxcclxuICAgIGNvbnN0IHRvdGFsQW1vdW50ID1cclxuICAgICAgaW5zdGFsbG1lbnQgKlxyXG4gICAgICAoKE1hdGgucG93KDEgKyBtb250aGx5UmF0ZSwgbW9udGhzKSAtIDEpIC8gbW9udGhseVJhdGUpICpcclxuICAgICAgKDEgKyBtb250aGx5UmF0ZSk7XHJcblxyXG4gICAgc2V0U2lwVmFsdWUodG90YWxBbW91bnQudG9GaXhlZCgyKSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcmVuZGVyU2xpZGVyV2l0aFRleHRib3ggPSAobGFiZWwsIHZhbHVlLCBzZXRWYWx1ZSwgbWluLCBtYXgsIHN0ZXAsIHVuaXQgPSBcIlwiKSA9PiB7XHJcbiAgICBjb25zdCBbc2hvd1Rvb2x0aXAsIHNldFNob3dUb29sdGlwXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8Qm94IG1iPXs2fSB3aWR0aD1cIjEwMCVcIj5cclxuICAgICAgICA8VGV4dCBtYj17Mn0+e2xhYmVsfTwvVGV4dD5cclxuICAgICAgICA8RmxleCBhbGlnbkl0ZW1zPVwiY2VudGVyXCI+XHJcbiAgICAgICAgICA8U2xpZGVyXHJcbiAgICAgICAgICAgIGZsZXg9XCIxXCJcclxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt2YWx1ZX1cclxuICAgICAgICAgICAgbWluPXttaW59XHJcbiAgICAgICAgICAgIG1heD17bWF4fVxyXG4gICAgICAgICAgICBzdGVwPXtzdGVwfVxyXG4gICAgICAgICAgICB2YWx1ZT17dmFsdWV9XHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gc2V0VmFsdWUodil9XHJcbiAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0U2hvd1Rvb2x0aXAodHJ1ZSl9XHJcbiAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17KCkgPT4gc2V0U2hvd1Rvb2x0aXAoZmFsc2UpfVxyXG4gICAgICAgICAgICBjb2xvclNjaGVtZT1cInRlYWxcIlxyXG4gICAgICAgICAgICBtcj17NH1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgPFNsaWRlclRyYWNrPlxyXG4gICAgICAgICAgICAgIDxTbGlkZXJGaWxsZWRUcmFjayAvPlxyXG4gICAgICAgICAgICA8L1NsaWRlclRyYWNrPlxyXG4gICAgICAgICAgICA8VG9vbHRpcFxyXG4gICAgICAgICAgICAgIGhhc0Fycm93XHJcbiAgICAgICAgICAgICAgYmc9XCJ0ZWFsLjUwMFwiXHJcbiAgICAgICAgICAgICAgY29sb3I9XCJ3aGl0ZVwiXHJcbiAgICAgICAgICAgICAgcGxhY2VtZW50PVwidG9wXCJcclxuICAgICAgICAgICAgICBpc09wZW49e3Nob3dUb29sdGlwfVxyXG4gICAgICAgICAgICAgIGxhYmVsPXtgJHt2YWx1ZX0ke3VuaXR9YH1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxTbGlkZXJUaHVtYiAvPlxyXG4gICAgICAgICAgICA8L1Rvb2x0aXA+XHJcbiAgICAgICAgICA8L1NsaWRlcj5cclxuICAgICAgICAgIDxJbnB1dFxyXG4gICAgICAgICAgICB3aWR0aD1cIjEwMHB4XCJcclxuICAgICAgICAgICAgdmFsdWU9e3ZhbHVlfVxyXG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFZhbHVlKHBhcnNlRmxvYXQoZS50YXJnZXQudmFsdWUpIHx8IDApfVxyXG4gICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgdGV4dEFsaWduPVwiY2VudGVyXCJcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9GbGV4PlxyXG4gICAgICA8L0JveD5cclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxCb3hcclxuICAgICAgZGlzcGxheT1cImZsZXhcIlxyXG4gICAgICBmbGV4RGlyZWN0aW9uPVwiY29sdW1uXCJcclxuICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXHJcbiAgICAgIGp1c3RpZnlDb250ZW50PVwiY2VudGVyXCJcclxuICAgICAgcD17Nn1cclxuICAgICAgYmc9XCJyZ2JhKDExNywgMTIyLCAxNDAsMC4yOTkpXCJcclxuICAgICAgY29sb3I9XCJ3aGl0ZVwiXHJcbiAgICAgIGJvcmRlclJhZGl1cz1cInhsXCJcclxuICAgICAgc2hhZG93PVwibWRcIlxyXG4gICAgICB3aWR0aD1cIjEwMCVcIlxyXG4gICAgICBtYXhXaWR0aD1cIjQwMHB4XCJcclxuICAgICAgbXg9XCJhdXRvXCJcclxuICAgID5cclxuICAgICAgPFRleHQgZm9udFNpemU9XCIyeGxcIiBmb250V2VpZ2h0PVwiYm9sZFwiIG1iPXs2fSB0ZXh0QWxpZ249XCJjZW50ZXJcIj5cclxuICAgICAgICBTSVAgQ2FsY3VsYXRvclxyXG4gICAgICA8L1RleHQ+XHJcblxyXG4gICAgICB7cmVuZGVyU2xpZGVyV2l0aFRleHRib3goXHJcbiAgICAgICAgXCJNb250aGx5IEluc3RhbGxtZW50ICjigrkpXCIsXHJcbiAgICAgICAgaW5zdGFsbG1lbnQsXHJcbiAgICAgICAgc2V0SW5zdGFsbG1lbnQsXHJcbiAgICAgICAgNTAwLFxyXG4gICAgICAgIDUwMDAwLFxyXG4gICAgICAgIDEwMCxcclxuICAgICAgICBcIuKCuVwiXHJcbiAgICAgICl9XHJcbiAgICAgIHtyZW5kZXJTbGlkZXJXaXRoVGV4dGJveChcclxuICAgICAgICBcIkFubnVhbCBJbnRlcmVzdCBSYXRlICglKVwiLFxyXG4gICAgICAgIHJhdGUsXHJcbiAgICAgICAgc2V0UmF0ZSxcclxuICAgICAgICAxLFxyXG4gICAgICAgIDIwLFxyXG4gICAgICAgIDAuNSxcclxuICAgICAgICBcIiVcIlxyXG4gICAgICApfVxyXG4gICAgICB7cmVuZGVyU2xpZGVyV2l0aFRleHRib3goXCJUaW1lIFBlcmlvZCAoTW9udGhzKVwiLCBtb250aHMsIHNldE1vbnRocywgNiwgMzYwLCA2KX1cclxuXHJcbiAgICAgIDxCdXR0b25cclxuICAgICAgICBjb2xvcj1cIiNlYmVmZjRcIlxyXG4gICAgICAgIGJnR3JhZGllbnQ9XCJsaW5lYXIodG8tciwgIzAwNzVmZiAsICAjOWY3YWVhKVwiXHJcbiAgICAgICAgb25DbGljaz17Y2FsY3VsYXRlU0lQfVxyXG4gICAgICAgIHdpZHRoPVwiMTAwJVwiXHJcbiAgICAgICAgbWI9ezR9XHJcbiAgICAgID5cclxuICAgICAgICBDYWxjdWxhdGUgU0lQXHJcbiAgICAgIDwvQnV0dG9uPlxyXG5cclxuICAgICAge3NpcFZhbHVlICYmIChcclxuICAgICAgICA8VGV4dCBmb250U2l6ZT1cImxnXCIgY29sb3I9XCJncmVlbi41MDBcIiBtdD17NH0+XHJcbiAgICAgICAgICBGdXR1cmUgVmFsdWU6IOKCuXtzaXBWYWx1ZX1cclxuICAgICAgICA8L1RleHQ+XHJcbiAgICAgICl9XHJcbiAgICA8L0JveD5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgU0lQQ2FsY3VsYXRvcjtcclxuIl0sIm5hbWVzIjpbIkJveCIsIkJ1dHRvbiIsIlNsaWRlciIsIlNsaWRlck1hcmsiLCJTbGlkZXJUcmFjayIsIlNsaWRlckZpbGxlZFRyYWNrIiwiU2xpZGVyVGh1bWIiLCJUb29sdGlwIiwiVGV4dCIsIkZsZXgiLCJJbnB1dCIsIlJlYWN0IiwidXNlU3RhdGUiLCJTSVBDYWxjdWxhdG9yIiwiaW5zdGFsbG1lbnQiLCJzZXRJbnN0YWxsbWVudCIsInJhdGUiLCJzZXRSYXRlIiwibW9udGhzIiwic2V0TW9udGhzIiwic2lwVmFsdWUiLCJzZXRTaXBWYWx1ZSIsImNhbGN1bGF0ZVNJUCIsIm1vbnRobHlSYXRlIiwidG90YWxBbW91bnQiLCJNYXRoIiwicG93IiwidG9GaXhlZCIsInJlbmRlclNsaWRlcldpdGhUZXh0Ym94IiwibGFiZWwiLCJ2YWx1ZSIsInNldFZhbHVlIiwibWluIiwibWF4Iiwic3RlcCIsInVuaXQiLCJzaG93VG9vbHRpcCIsInNldFNob3dUb29sdGlwIiwibWIiLCJ3aWR0aCIsImFsaWduSXRlbXMiLCJmbGV4IiwiZGVmYXVsdFZhbHVlIiwib25DaGFuZ2UiLCJ2Iiwib25Nb3VzZUVudGVyIiwib25Nb3VzZUxlYXZlIiwiY29sb3JTY2hlbWUiLCJtciIsImhhc0Fycm93IiwiYmciLCJjb2xvciIsInBsYWNlbWVudCIsImlzT3BlbiIsImUiLCJwYXJzZUZsb2F0IiwidGFyZ2V0IiwidHlwZSIsInRleHRBbGlnbiIsImRpc3BsYXkiLCJmbGV4RGlyZWN0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJwIiwiYm9yZGVyUmFkaXVzIiwic2hhZG93IiwibWF4V2lkdGgiLCJteCIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsImJnR3JhZGllbnQiLCJvbkNsaWNrIiwibXQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/components/SIPCal.js\n"));

/***/ })

});