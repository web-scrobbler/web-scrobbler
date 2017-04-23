'use strict';

module.exports = {
	'env': {
		'browser': true,
		'es6': true,
		'node': true,
		'mocha': true
	},
	'globals': {
		'$': true,
		'chrome': true,
		'Require': true,
		'define': true
	},
	'rules': {
		/**
		 * Possible errors
		 */
		// Disallow assignment operators in conditional expressions
		'no-cond-assign': 'error',
		// Disallow constant expressions in conditions
		'no-constant-condition': 'error',
		// Disallow duplicate arguments in function definitions
		'no-dupe-args': 'error',
		// Disallow duplicate keys in object literals
		'no-dupe-keys': 'error',
		// Disallow duplicate case labels
		'no-duplicate-case': 'error',
		// Disallow empty block statements
		'no-empty': 'error',
		// Disallow reassigning exceptions in `catch` clauses
		'no-ex-assign': 'error',
		// Disallow unnecessary boolean casts
		'no-extra-boolean-cast': 'error',
		// Disallow unnecessary semicolons
		'no-extra-semi': 'error',
		// Disallow reassigning function declarations
		'no-func-assign': 'error',
		// Disallow calling global object properties as functions
		'no-obj-calls': 'error',
		// Disallow template literal placeholder syntax in regular string
		'no-template-curly-in-string': 'error',
		// Disallow unreachable code after return, throw, continue,
		// and break statements
		'no-unreachable': 'error',
		// Require calls to `isNaN()` when checking for `NaN`
		'no-unsafe-negation': 'error',
		// Disallow negating the left operand of relational operators
		'use-isnan': 'error',
		// Enforce comparing `typeof` expressions against valid strings
		'valid-typeof': 'error',

		/**
		 * Best practices
		 */
		// Enforce consistent brace style for all control statements
		'curly': 'error',
		// Require the use of === and !==
		'eqeqeq': 'error',
		// Disallow `else` blocks after `return` statements in `if` statements
		'no-else-return': 'error',
		// Disallow empty functions
		// 'no-empty-function': 'error',
		// Disallow assignments to native objects or read-only global variables
		'no-global-assign': 'error',
		// Disallow function declarations and expressions inside loop statements
		'no-loop-func': 'error',
		// Disallow new operators with the String, Number, and Boolean objects
		'no-new-wrappers': 'error',
		// Disallow variable redeclaration
		'no-redeclare': 'error',
		// Disallow assignments where both sides are exactly the same
		'no-self-assign': 'error',
		// Disallow redundant return statements
		'no-useless-return': 'error',

		/**
		 * Strict mode
		 */
		// Require global strict mode directive
		'strict': ['error', 'global'],

		/**
		 * Variables
		 */
		// Disallow the use of undeclared variables
		'no-undef': 'error',
		// Disallow unused variables
		'no-unused-vars': 'error',

		/**
		 * Stylistic Issues
		 */
		// Require 'one true brace style', in which the opening brace
		// of a block is placed on the same line as its corresponding
		// statement or declaration
		// 'brace-style': ['error', '1tbs'],
		// Require space after comma
		'comma-spacing': ['error', {'after': true}],
		// Require or Disallow newline at the end of files
		'eol-last': ['error', 'always'],
		// Disallow spacing between function identifiers and their invocations
		'func-call-spacing': 'error',
		// use tabs as indentation
		'indent': ['error', 'tab', {
			// enforces indentation level for case clauses in switch statements
			'SwitchCase': 1,
		}],
		// Require space after colon in object literal properties
		'key-spacing': ['error', {'afterColon': true}],
		// Require space before and after keywords
		'keyword-spacing': ['error'],
		// Require Unix line endings
		'linebreak-style': ['error', 'unix'],
		// Disallow empty block statements
		'no-empty': ['error', {'allowEmptyCatch': true}],
		// Disallow `if` statements as the only statement in `else` blocks
		'no-lonely-if': 'error',
		// Disallow mixed spaces and tabs for indentation
		'no-mixed-spaces-and-tabs': 'error',
		// Disallow multiple spaces
		'no-multi-spaces': 'error',
		// Disallow nested ternary expressions
		'no-nested-ternary': 'error',
		// Disallow trailing whitespace at the end of lines
		'no-trailing-spaces': 'error',
		// Disallow ternary operators when simpler alternatives exist
		'no-unneeded-ternary': 'error',
		// Disallow whitespace before properties
		'no-whitespace-before-property': 'error',
		// Require single quotes
		'quotes': ['error', 'single'],
		// Require space before blocks
		'space-before-blocks': ['error', 'always'],
		// Disallow spaces inside of parentheses
		'space-in-parens': 'error',
		// Require spacing around infix operators
		'space-infix-ops': 'error',
		// Require semicolon at the end of statement
		'semi': ['error', 'always'],

		/**
		 * ECMAScript 6
		 */
		// Disallow reassigning class members
		'no-class-assign': 'error',
		// Disallow modifying variables that are declared using `const`
		'no-const-assign': 'error',
		// Disallow spacing around embedded expressions of template strings
		'template-curly-spacing': 'error',

		/**
		 * Warnings
		 */
		// Disallow fallthrough of case statements
		//
		// This approach could be used as a trick, but we should warn
		// the developer to make sure they suppress warning in the code
		// and (possibly) put the explanation of fallthrougt in comments.
		'no-fallthrough': 'warn',
	}
};
