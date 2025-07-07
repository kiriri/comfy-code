#!/usr/bin/env -S node --no-warnings
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/commander/lib/error.js
var require_error = __commonJS({
  "node_modules/commander/lib/error.js"(exports2) {
    var CommanderError2 = class extends Error {
      /**
       * Constructs the CommanderError class
       * @param {number} exitCode suggested exit code which could be used with process.exit
       * @param {string} code an id string representing the error
       * @param {string} message human-readable description of the error
       */
      constructor(exitCode, code, message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.code = code;
        this.exitCode = exitCode;
        this.nestedError = void 0;
      }
    };
    var InvalidArgumentError2 = class extends CommanderError2 {
      /**
       * Constructs the InvalidArgumentError class
       * @param {string} [message] explanation of why argument is invalid
       */
      constructor(message) {
        super(1, "commander.invalidArgument", message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
      }
    };
    exports2.CommanderError = CommanderError2;
    exports2.InvalidArgumentError = InvalidArgumentError2;
  }
});

// node_modules/commander/lib/argument.js
var require_argument = __commonJS({
  "node_modules/commander/lib/argument.js"(exports2) {
    var { InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var Argument2 = class {
      /**
       * Initialize a new command argument with the given name and description.
       * The default is that the argument is required, and you can explicitly
       * indicate this with <> around the name. Put [] around the name for an optional argument.
       *
       * @param {string} name
       * @param {string} [description]
       */
      constructor(name, description) {
        this.description = description || "";
        this.variadic = false;
        this.parseArg = void 0;
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.argChoices = void 0;
        switch (name[0]) {
          case "<":
            this.required = true;
            this._name = name.slice(1, -1);
            break;
          case "[":
            this.required = false;
            this._name = name.slice(1, -1);
            break;
          default:
            this.required = true;
            this._name = name;
            break;
        }
        if (this._name.length > 3 && this._name.slice(-3) === "...") {
          this.variadic = true;
          this._name = this._name.slice(0, -3);
        }
      }
      /**
       * Return argument name.
       *
       * @return {string}
       */
      name() {
        return this._name;
      }
      /**
       * @package
       */
      _concatValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        return previous.concat(value);
      }
      /**
       * Set the default value, and optionally supply the description to be displayed in the help.
       *
       * @param {*} value
       * @param {string} [description]
       * @return {Argument}
       */
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      /**
       * Set the custom handler for processing CLI command arguments into argument values.
       *
       * @param {Function} [fn]
       * @return {Argument}
       */
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      /**
       * Only allow argument value to be one of choices.
       *
       * @param {string[]} values
       * @return {Argument}
       */
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError2(
              `Allowed choices are ${this.argChoices.join(", ")}.`
            );
          }
          if (this.variadic) {
            return this._concatValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      /**
       * Make argument required.
       *
       * @returns {Argument}
       */
      argRequired() {
        this.required = true;
        return this;
      }
      /**
       * Make argument optional.
       *
       * @returns {Argument}
       */
      argOptional() {
        this.required = false;
        return this;
      }
    };
    function humanReadableArgName(arg) {
      const nameOutput = arg.name() + (arg.variadic === true ? "..." : "");
      return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
    }
    exports2.Argument = Argument2;
    exports2.humanReadableArgName = humanReadableArgName;
  }
});

// node_modules/commander/lib/help.js
var require_help = __commonJS({
  "node_modules/commander/lib/help.js"(exports2) {
    var { humanReadableArgName } = require_argument();
    var Help2 = class {
      constructor() {
        this.helpWidth = void 0;
        this.minWidthToWrap = 40;
        this.sortSubcommands = false;
        this.sortOptions = false;
        this.showGlobalOptions = false;
      }
      /**
       * prepareContext is called by Commander after applying overrides from `Command.configureHelp()`
       * and just before calling `formatHelp()`.
       *
       * Commander just uses the helpWidth and the rest is provided for optional use by more complex subclasses.
       *
       * @param {{ error?: boolean, helpWidth?: number, outputHasColors?: boolean }} contextOptions
       */
      prepareContext(contextOptions) {
        this.helpWidth = this.helpWidth ?? contextOptions.helpWidth ?? 80;
      }
      /**
       * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
       *
       * @param {Command} cmd
       * @returns {Command[]}
       */
      visibleCommands(cmd) {
        const visibleCommands = cmd.commands.filter((cmd2) => !cmd2._hidden);
        const helpCommand = cmd._getHelpCommand();
        if (helpCommand && !helpCommand._hidden) {
          visibleCommands.push(helpCommand);
        }
        if (this.sortSubcommands) {
          visibleCommands.sort((a, b) => {
            return a.name().localeCompare(b.name());
          });
        }
        return visibleCommands;
      }
      /**
       * Compare options for sort.
       *
       * @param {Option} a
       * @param {Option} b
       * @returns {number}
       */
      compareOptions(a, b) {
        const getSortKey = (option) => {
          return option.short ? option.short.replace(/^-/, "") : option.long.replace(/^--/, "");
        };
        return getSortKey(a).localeCompare(getSortKey(b));
      }
      /**
       * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
       *
       * @param {Command} cmd
       * @returns {Option[]}
       */
      visibleOptions(cmd) {
        const visibleOptions = cmd.options.filter((option) => !option.hidden);
        const helpOption = cmd._getHelpOption();
        if (helpOption && !helpOption.hidden) {
          const removeShort = helpOption.short && cmd._findOption(helpOption.short);
          const removeLong = helpOption.long && cmd._findOption(helpOption.long);
          if (!removeShort && !removeLong) {
            visibleOptions.push(helpOption);
          } else if (helpOption.long && !removeLong) {
            visibleOptions.push(
              cmd.createOption(helpOption.long, helpOption.description)
            );
          } else if (helpOption.short && !removeShort) {
            visibleOptions.push(
              cmd.createOption(helpOption.short, helpOption.description)
            );
          }
        }
        if (this.sortOptions) {
          visibleOptions.sort(this.compareOptions);
        }
        return visibleOptions;
      }
      /**
       * Get an array of the visible global options. (Not including help.)
       *
       * @param {Command} cmd
       * @returns {Option[]}
       */
      visibleGlobalOptions(cmd) {
        if (!this.showGlobalOptions) return [];
        const globalOptions = [];
        for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
          const visibleOptions = ancestorCmd.options.filter(
            (option) => !option.hidden
          );
          globalOptions.push(...visibleOptions);
        }
        if (this.sortOptions) {
          globalOptions.sort(this.compareOptions);
        }
        return globalOptions;
      }
      /**
       * Get an array of the arguments if any have a description.
       *
       * @param {Command} cmd
       * @returns {Argument[]}
       */
      visibleArguments(cmd) {
        if (cmd._argsDescription) {
          cmd.registeredArguments.forEach((argument) => {
            argument.description = argument.description || cmd._argsDescription[argument.name()] || "";
          });
        }
        if (cmd.registeredArguments.find((argument) => argument.description)) {
          return cmd.registeredArguments;
        }
        return [];
      }
      /**
       * Get the command term to show in the list of subcommands.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      subcommandTerm(cmd) {
        const args = cmd.registeredArguments.map((arg) => humanReadableArgName(arg)).join(" ");
        return cmd._name + (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") + (cmd.options.length ? " [options]" : "") + // simplistic check for non-help option
        (args ? " " + args : "");
      }
      /**
       * Get the option term to show in the list of options.
       *
       * @param {Option} option
       * @returns {string}
       */
      optionTerm(option) {
        return option.flags;
      }
      /**
       * Get the argument term to show in the list of arguments.
       *
       * @param {Argument} argument
       * @returns {string}
       */
      argumentTerm(argument) {
        return argument.name();
      }
      /**
       * Get the longest command term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestSubcommandTermLength(cmd, helper) {
        return helper.visibleCommands(cmd).reduce((max, command) => {
          return Math.max(
            max,
            this.displayWidth(
              helper.styleSubcommandTerm(helper.subcommandTerm(command))
            )
          );
        }, 0);
      }
      /**
       * Get the longest option term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestOptionTermLength(cmd, helper) {
        return helper.visibleOptions(cmd).reduce((max, option) => {
          return Math.max(
            max,
            this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option)))
          );
        }, 0);
      }
      /**
       * Get the longest global option term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestGlobalOptionTermLength(cmd, helper) {
        return helper.visibleGlobalOptions(cmd).reduce((max, option) => {
          return Math.max(
            max,
            this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option)))
          );
        }, 0);
      }
      /**
       * Get the longest argument term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestArgumentTermLength(cmd, helper) {
        return helper.visibleArguments(cmd).reduce((max, argument) => {
          return Math.max(
            max,
            this.displayWidth(
              helper.styleArgumentTerm(helper.argumentTerm(argument))
            )
          );
        }, 0);
      }
      /**
       * Get the command usage to be displayed at the top of the built-in help.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      commandUsage(cmd) {
        let cmdName = cmd._name;
        if (cmd._aliases[0]) {
          cmdName = cmdName + "|" + cmd._aliases[0];
        }
        let ancestorCmdNames = "";
        for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
          ancestorCmdNames = ancestorCmd.name() + " " + ancestorCmdNames;
        }
        return ancestorCmdNames + cmdName + " " + cmd.usage();
      }
      /**
       * Get the description for the command.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      commandDescription(cmd) {
        return cmd.description();
      }
      /**
       * Get the subcommand summary to show in the list of subcommands.
       * (Fallback to description for backwards compatibility.)
       *
       * @param {Command} cmd
       * @returns {string}
       */
      subcommandDescription(cmd) {
        return cmd.summary() || cmd.description();
      }
      /**
       * Get the option description to show in the list of options.
       *
       * @param {Option} option
       * @return {string}
       */
      optionDescription(option) {
        const extraInfo = [];
        if (option.argChoices) {
          extraInfo.push(
            // use stringify to match the display of the default value
            `choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
          );
        }
        if (option.defaultValue !== void 0) {
          const showDefault = option.required || option.optional || option.isBoolean() && typeof option.defaultValue === "boolean";
          if (showDefault) {
            extraInfo.push(
              `default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`
            );
          }
        }
        if (option.presetArg !== void 0 && option.optional) {
          extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
        }
        if (option.envVar !== void 0) {
          extraInfo.push(`env: ${option.envVar}`);
        }
        if (extraInfo.length > 0) {
          return `${option.description} (${extraInfo.join(", ")})`;
        }
        return option.description;
      }
      /**
       * Get the argument description to show in the list of arguments.
       *
       * @param {Argument} argument
       * @return {string}
       */
      argumentDescription(argument) {
        const extraInfo = [];
        if (argument.argChoices) {
          extraInfo.push(
            // use stringify to match the display of the default value
            `choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
          );
        }
        if (argument.defaultValue !== void 0) {
          extraInfo.push(
            `default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`
          );
        }
        if (extraInfo.length > 0) {
          const extraDescription = `(${extraInfo.join(", ")})`;
          if (argument.description) {
            return `${argument.description} ${extraDescription}`;
          }
          return extraDescription;
        }
        return argument.description;
      }
      /**
       * Generate the built-in help text.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {string}
       */
      formatHelp(cmd, helper) {
        const termWidth = helper.padWidth(cmd, helper);
        const helpWidth = helper.helpWidth ?? 80;
        function callFormatItem(term, description) {
          return helper.formatItem(term, termWidth, description, helper);
        }
        let output = [
          `${helper.styleTitle("Usage:")} ${helper.styleUsage(helper.commandUsage(cmd))}`,
          ""
        ];
        const commandDescription = helper.commandDescription(cmd);
        if (commandDescription.length > 0) {
          output = output.concat([
            helper.boxWrap(
              helper.styleCommandDescription(commandDescription),
              helpWidth
            ),
            ""
          ]);
        }
        const argumentList = helper.visibleArguments(cmd).map((argument) => {
          return callFormatItem(
            helper.styleArgumentTerm(helper.argumentTerm(argument)),
            helper.styleArgumentDescription(helper.argumentDescription(argument))
          );
        });
        if (argumentList.length > 0) {
          output = output.concat([
            helper.styleTitle("Arguments:"),
            ...argumentList,
            ""
          ]);
        }
        const optionList = helper.visibleOptions(cmd).map((option) => {
          return callFormatItem(
            helper.styleOptionTerm(helper.optionTerm(option)),
            helper.styleOptionDescription(helper.optionDescription(option))
          );
        });
        if (optionList.length > 0) {
          output = output.concat([
            helper.styleTitle("Options:"),
            ...optionList,
            ""
          ]);
        }
        if (helper.showGlobalOptions) {
          const globalOptionList = helper.visibleGlobalOptions(cmd).map((option) => {
            return callFormatItem(
              helper.styleOptionTerm(helper.optionTerm(option)),
              helper.styleOptionDescription(helper.optionDescription(option))
            );
          });
          if (globalOptionList.length > 0) {
            output = output.concat([
              helper.styleTitle("Global Options:"),
              ...globalOptionList,
              ""
            ]);
          }
        }
        const commandList = helper.visibleCommands(cmd).map((cmd2) => {
          return callFormatItem(
            helper.styleSubcommandTerm(helper.subcommandTerm(cmd2)),
            helper.styleSubcommandDescription(helper.subcommandDescription(cmd2))
          );
        });
        if (commandList.length > 0) {
          output = output.concat([
            helper.styleTitle("Commands:"),
            ...commandList,
            ""
          ]);
        }
        return output.join("\n");
      }
      /**
       * Return display width of string, ignoring ANSI escape sequences. Used in padding and wrapping calculations.
       *
       * @param {string} str
       * @returns {number}
       */
      displayWidth(str) {
        return stripColor(str).length;
      }
      /**
       * Style the title for displaying in the help. Called with 'Usage:', 'Options:', etc.
       *
       * @param {string} str
       * @returns {string}
       */
      styleTitle(str) {
        return str;
      }
      styleUsage(str) {
        return str.split(" ").map((word) => {
          if (word === "[options]") return this.styleOptionText(word);
          if (word === "[command]") return this.styleSubcommandText(word);
          if (word[0] === "[" || word[0] === "<")
            return this.styleArgumentText(word);
          return this.styleCommandText(word);
        }).join(" ");
      }
      styleCommandDescription(str) {
        return this.styleDescriptionText(str);
      }
      styleOptionDescription(str) {
        return this.styleDescriptionText(str);
      }
      styleSubcommandDescription(str) {
        return this.styleDescriptionText(str);
      }
      styleArgumentDescription(str) {
        return this.styleDescriptionText(str);
      }
      styleDescriptionText(str) {
        return str;
      }
      styleOptionTerm(str) {
        return this.styleOptionText(str);
      }
      styleSubcommandTerm(str) {
        return str.split(" ").map((word) => {
          if (word === "[options]") return this.styleOptionText(word);
          if (word[0] === "[" || word[0] === "<")
            return this.styleArgumentText(word);
          return this.styleSubcommandText(word);
        }).join(" ");
      }
      styleArgumentTerm(str) {
        return this.styleArgumentText(str);
      }
      styleOptionText(str) {
        return str;
      }
      styleArgumentText(str) {
        return str;
      }
      styleSubcommandText(str) {
        return str;
      }
      styleCommandText(str) {
        return str;
      }
      /**
       * Calculate the pad width from the maximum term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      padWidth(cmd, helper) {
        return Math.max(
          helper.longestOptionTermLength(cmd, helper),
          helper.longestGlobalOptionTermLength(cmd, helper),
          helper.longestSubcommandTermLength(cmd, helper),
          helper.longestArgumentTermLength(cmd, helper)
        );
      }
      /**
       * Detect manually wrapped and indented strings by checking for line break followed by whitespace.
       *
       * @param {string} str
       * @returns {boolean}
       */
      preformatted(str) {
        return /\n[^\S\r\n]/.test(str);
      }
      /**
       * Format the "item", which consists of a term and description. Pad the term and wrap the description, indenting the following lines.
       *
       * So "TTT", 5, "DDD DDDD DD DDD" might be formatted for this.helpWidth=17 like so:
       *   TTT  DDD DDDD
       *        DD DDD
       *
       * @param {string} term
       * @param {number} termWidth
       * @param {string} description
       * @param {Help} helper
       * @returns {string}
       */
      formatItem(term, termWidth, description, helper) {
        const itemIndent = 2;
        const itemIndentStr = " ".repeat(itemIndent);
        if (!description) return itemIndentStr + term;
        const paddedTerm = term.padEnd(
          termWidth + term.length - helper.displayWidth(term)
        );
        const spacerWidth = 2;
        const helpWidth = this.helpWidth ?? 80;
        const remainingWidth = helpWidth - termWidth - spacerWidth - itemIndent;
        let formattedDescription;
        if (remainingWidth < this.minWidthToWrap || helper.preformatted(description)) {
          formattedDescription = description;
        } else {
          const wrappedDescription = helper.boxWrap(description, remainingWidth);
          formattedDescription = wrappedDescription.replace(
            /\n/g,
            "\n" + " ".repeat(termWidth + spacerWidth)
          );
        }
        return itemIndentStr + paddedTerm + " ".repeat(spacerWidth) + formattedDescription.replace(/\n/g, `
${itemIndentStr}`);
      }
      /**
       * Wrap a string at whitespace, preserving existing line breaks.
       * Wrapping is skipped if the width is less than `minWidthToWrap`.
       *
       * @param {string} str
       * @param {number} width
       * @returns {string}
       */
      boxWrap(str, width) {
        if (width < this.minWidthToWrap) return str;
        const rawLines = str.split(/\r\n|\n/);
        const chunkPattern = /[\s]*[^\s]+/g;
        const wrappedLines = [];
        rawLines.forEach((line) => {
          const chunks = line.match(chunkPattern);
          if (chunks === null) {
            wrappedLines.push("");
            return;
          }
          let sumChunks = [chunks.shift()];
          let sumWidth = this.displayWidth(sumChunks[0]);
          chunks.forEach((chunk) => {
            const visibleWidth = this.displayWidth(chunk);
            if (sumWidth + visibleWidth <= width) {
              sumChunks.push(chunk);
              sumWidth += visibleWidth;
              return;
            }
            wrappedLines.push(sumChunks.join(""));
            const nextChunk = chunk.trimStart();
            sumChunks = [nextChunk];
            sumWidth = this.displayWidth(nextChunk);
          });
          wrappedLines.push(sumChunks.join(""));
        });
        return wrappedLines.join("\n");
      }
    };
    function stripColor(str) {
      const sgrPattern = /\x1b\[\d*(;\d*)*m/g;
      return str.replace(sgrPattern, "");
    }
    exports2.Help = Help2;
    exports2.stripColor = stripColor;
  }
});

// node_modules/commander/lib/option.js
var require_option = __commonJS({
  "node_modules/commander/lib/option.js"(exports2) {
    var { InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var Option2 = class {
      /**
       * Initialize a new `Option` with the given `flags` and `description`.
       *
       * @param {string} flags
       * @param {string} [description]
       */
      constructor(flags, description) {
        this.flags = flags;
        this.description = description || "";
        this.required = flags.includes("<");
        this.optional = flags.includes("[");
        this.variadic = /\w\.\.\.[>\]]$/.test(flags);
        this.mandatory = false;
        const optionFlags = splitOptionFlags(flags);
        this.short = optionFlags.shortFlag;
        this.long = optionFlags.longFlag;
        this.negate = false;
        if (this.long) {
          this.negate = this.long.startsWith("--no-");
        }
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.presetArg = void 0;
        this.envVar = void 0;
        this.parseArg = void 0;
        this.hidden = false;
        this.argChoices = void 0;
        this.conflictsWith = [];
        this.implied = void 0;
      }
      /**
       * Set the default value, and optionally supply the description to be displayed in the help.
       *
       * @param {*} value
       * @param {string} [description]
       * @return {Option}
       */
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      /**
       * Preset to use when option used without option-argument, especially optional but also boolean and negated.
       * The custom processing (parseArg) is called.
       *
       * @example
       * new Option('--color').default('GREYSCALE').preset('RGB');
       * new Option('--donate [amount]').preset('20').argParser(parseFloat);
       *
       * @param {*} arg
       * @return {Option}
       */
      preset(arg) {
        this.presetArg = arg;
        return this;
      }
      /**
       * Add option name(s) that conflict with this option.
       * An error will be displayed if conflicting options are found during parsing.
       *
       * @example
       * new Option('--rgb').conflicts('cmyk');
       * new Option('--js').conflicts(['ts', 'jsx']);
       *
       * @param {(string | string[])} names
       * @return {Option}
       */
      conflicts(names) {
        this.conflictsWith = this.conflictsWith.concat(names);
        return this;
      }
      /**
       * Specify implied option values for when this option is set and the implied options are not.
       *
       * The custom processing (parseArg) is not called on the implied values.
       *
       * @example
       * program
       *   .addOption(new Option('--log', 'write logging information to file'))
       *   .addOption(new Option('--trace', 'log extra details').implies({ log: 'trace.txt' }));
       *
       * @param {object} impliedOptionValues
       * @return {Option}
       */
      implies(impliedOptionValues) {
        let newImplied = impliedOptionValues;
        if (typeof impliedOptionValues === "string") {
          newImplied = { [impliedOptionValues]: true };
        }
        this.implied = Object.assign(this.implied || {}, newImplied);
        return this;
      }
      /**
       * Set environment variable to check for option value.
       *
       * An environment variable is only used if when processed the current option value is
       * undefined, or the source of the current value is 'default' or 'config' or 'env'.
       *
       * @param {string} name
       * @return {Option}
       */
      env(name) {
        this.envVar = name;
        return this;
      }
      /**
       * Set the custom handler for processing CLI option arguments into option values.
       *
       * @param {Function} [fn]
       * @return {Option}
       */
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      /**
       * Whether the option is mandatory and must have a value after parsing.
       *
       * @param {boolean} [mandatory=true]
       * @return {Option}
       */
      makeOptionMandatory(mandatory = true) {
        this.mandatory = !!mandatory;
        return this;
      }
      /**
       * Hide option in help.
       *
       * @param {boolean} [hide=true]
       * @return {Option}
       */
      hideHelp(hide = true) {
        this.hidden = !!hide;
        return this;
      }
      /**
       * @package
       */
      _concatValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        return previous.concat(value);
      }
      /**
       * Only allow option value to be one of choices.
       *
       * @param {string[]} values
       * @return {Option}
       */
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError2(
              `Allowed choices are ${this.argChoices.join(", ")}.`
            );
          }
          if (this.variadic) {
            return this._concatValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      /**
       * Return option name.
       *
       * @return {string}
       */
      name() {
        if (this.long) {
          return this.long.replace(/^--/, "");
        }
        return this.short.replace(/^-/, "");
      }
      /**
       * Return option name, in a camelcase format that can be used
       * as an object attribute key.
       *
       * @return {string}
       */
      attributeName() {
        if (this.negate) {
          return camelcase(this.name().replace(/^no-/, ""));
        }
        return camelcase(this.name());
      }
      /**
       * Check if `arg` matches the short or long flag.
       *
       * @param {string} arg
       * @return {boolean}
       * @package
       */
      is(arg) {
        return this.short === arg || this.long === arg;
      }
      /**
       * Return whether a boolean option.
       *
       * Options are one of boolean, negated, required argument, or optional argument.
       *
       * @return {boolean}
       * @package
       */
      isBoolean() {
        return !this.required && !this.optional && !this.negate;
      }
    };
    var DualOptions = class {
      /**
       * @param {Option[]} options
       */
      constructor(options) {
        this.positiveOptions = /* @__PURE__ */ new Map();
        this.negativeOptions = /* @__PURE__ */ new Map();
        this.dualOptions = /* @__PURE__ */ new Set();
        options.forEach((option) => {
          if (option.negate) {
            this.negativeOptions.set(option.attributeName(), option);
          } else {
            this.positiveOptions.set(option.attributeName(), option);
          }
        });
        this.negativeOptions.forEach((value, key) => {
          if (this.positiveOptions.has(key)) {
            this.dualOptions.add(key);
          }
        });
      }
      /**
       * Did the value come from the option, and not from possible matching dual option?
       *
       * @param {*} value
       * @param {Option} option
       * @returns {boolean}
       */
      valueFromOption(value, option) {
        const optionKey = option.attributeName();
        if (!this.dualOptions.has(optionKey)) return true;
        const preset = this.negativeOptions.get(optionKey).presetArg;
        const negativeValue = preset !== void 0 ? preset : false;
        return option.negate === (negativeValue === value);
      }
    };
    function camelcase(str) {
      return str.split("-").reduce((str2, word) => {
        return str2 + word[0].toUpperCase() + word.slice(1);
      });
    }
    function splitOptionFlags(flags) {
      let shortFlag;
      let longFlag;
      const shortFlagExp = /^-[^-]$/;
      const longFlagExp = /^--[^-]/;
      const flagParts = flags.split(/[ |,]+/).concat("guard");
      if (shortFlagExp.test(flagParts[0])) shortFlag = flagParts.shift();
      if (longFlagExp.test(flagParts[0])) longFlag = flagParts.shift();
      if (!shortFlag && shortFlagExp.test(flagParts[0]))
        shortFlag = flagParts.shift();
      if (!shortFlag && longFlagExp.test(flagParts[0])) {
        shortFlag = longFlag;
        longFlag = flagParts.shift();
      }
      if (flagParts[0].startsWith("-")) {
        const unsupportedFlag = flagParts[0];
        const baseError = `option creation failed due to '${unsupportedFlag}' in option flags '${flags}'`;
        if (/^-[^-][^-]/.test(unsupportedFlag))
          throw new Error(
            `${baseError}
- a short flag is a single dash and a single character
  - either use a single dash and a single character (for a short flag)
  - or use a double dash for a long option (and can have two, like '--ws, --workspace')`
          );
        if (shortFlagExp.test(unsupportedFlag))
          throw new Error(`${baseError}
- too many short flags`);
        if (longFlagExp.test(unsupportedFlag))
          throw new Error(`${baseError}
- too many long flags`);
        throw new Error(`${baseError}
- unrecognised flag format`);
      }
      if (shortFlag === void 0 && longFlag === void 0)
        throw new Error(
          `option creation failed due to no flags found in '${flags}'.`
        );
      return { shortFlag, longFlag };
    }
    exports2.Option = Option2;
    exports2.DualOptions = DualOptions;
  }
});

// node_modules/commander/lib/suggestSimilar.js
var require_suggestSimilar = __commonJS({
  "node_modules/commander/lib/suggestSimilar.js"(exports2) {
    var maxDistance = 3;
    function editDistance(a, b) {
      if (Math.abs(a.length - b.length) > maxDistance)
        return Math.max(a.length, b.length);
      const d = [];
      for (let i = 0; i <= a.length; i++) {
        d[i] = [i];
      }
      for (let j = 0; j <= b.length; j++) {
        d[0][j] = j;
      }
      for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
          let cost = 1;
          if (a[i - 1] === b[j - 1]) {
            cost = 0;
          } else {
            cost = 1;
          }
          d[i][j] = Math.min(
            d[i - 1][j] + 1,
            // deletion
            d[i][j - 1] + 1,
            // insertion
            d[i - 1][j - 1] + cost
            // substitution
          );
          if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
            d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
          }
        }
      }
      return d[a.length][b.length];
    }
    function suggestSimilar(word, candidates) {
      if (!candidates || candidates.length === 0) return "";
      candidates = Array.from(new Set(candidates));
      const searchingOptions = word.startsWith("--");
      if (searchingOptions) {
        word = word.slice(2);
        candidates = candidates.map((candidate) => candidate.slice(2));
      }
      let similar = [];
      let bestDistance = maxDistance;
      const minSimilarity = 0.4;
      candidates.forEach((candidate) => {
        if (candidate.length <= 1) return;
        const distance = editDistance(word, candidate);
        const length = Math.max(word.length, candidate.length);
        const similarity = (length - distance) / length;
        if (similarity > minSimilarity) {
          if (distance < bestDistance) {
            bestDistance = distance;
            similar = [candidate];
          } else if (distance === bestDistance) {
            similar.push(candidate);
          }
        }
      });
      similar.sort((a, b) => a.localeCompare(b));
      if (searchingOptions) {
        similar = similar.map((candidate) => `--${candidate}`);
      }
      if (similar.length > 1) {
        return `
(Did you mean one of ${similar.join(", ")}?)`;
      }
      if (similar.length === 1) {
        return `
(Did you mean ${similar[0]}?)`;
      }
      return "";
    }
    exports2.suggestSimilar = suggestSimilar;
  }
});

// node_modules/commander/lib/command.js
var require_command = __commonJS({
  "node_modules/commander/lib/command.js"(exports2) {
    var EventEmitter2 = require("node:events").EventEmitter;
    var childProcess = require("node:child_process");
    var path4 = require("node:path");
    var fs4 = require("node:fs");
    var process3 = require("node:process");
    var { Argument: Argument2, humanReadableArgName } = require_argument();
    var { CommanderError: CommanderError2 } = require_error();
    var { Help: Help2, stripColor } = require_help();
    var { Option: Option2, DualOptions } = require_option();
    var { suggestSimilar } = require_suggestSimilar();
    var Command2 = class _Command extends EventEmitter2 {
      /**
       * Initialize a new `Command`.
       *
       * @param {string} [name]
       */
      constructor(name) {
        super();
        this.commands = [];
        this.options = [];
        this.parent = null;
        this._allowUnknownOption = false;
        this._allowExcessArguments = false;
        this.registeredArguments = [];
        this._args = this.registeredArguments;
        this.args = [];
        this.rawArgs = [];
        this.processedArgs = [];
        this._scriptPath = null;
        this._name = name || "";
        this._optionValues = {};
        this._optionValueSources = {};
        this._storeOptionsAsProperties = false;
        this._actionHandler = null;
        this._executableHandler = false;
        this._executableFile = null;
        this._executableDir = null;
        this._defaultCommandName = null;
        this._exitCallback = null;
        this._aliases = [];
        this._combineFlagAndOptionalValue = true;
        this._description = "";
        this._summary = "";
        this._argsDescription = void 0;
        this._enablePositionalOptions = false;
        this._passThroughOptions = false;
        this._lifeCycleHooks = {};
        this._showHelpAfterError = false;
        this._showSuggestionAfterError = true;
        this._savedState = null;
        this._outputConfiguration = {
          writeOut: (str) => process3.stdout.write(str),
          writeErr: (str) => process3.stderr.write(str),
          outputError: (str, write) => write(str),
          getOutHelpWidth: () => process3.stdout.isTTY ? process3.stdout.columns : void 0,
          getErrHelpWidth: () => process3.stderr.isTTY ? process3.stderr.columns : void 0,
          getOutHasColors: () => useColor() ?? (process3.stdout.isTTY && process3.stdout.hasColors?.()),
          getErrHasColors: () => useColor() ?? (process3.stderr.isTTY && process3.stderr.hasColors?.()),
          stripColor: (str) => stripColor(str)
        };
        this._hidden = false;
        this._helpOption = void 0;
        this._addImplicitHelpCommand = void 0;
        this._helpCommand = void 0;
        this._helpConfiguration = {};
      }
      /**
       * Copy settings that are useful to have in common across root command and subcommands.
       *
       * (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
       *
       * @param {Command} sourceCommand
       * @return {Command} `this` command for chaining
       */
      copyInheritedSettings(sourceCommand) {
        this._outputConfiguration = sourceCommand._outputConfiguration;
        this._helpOption = sourceCommand._helpOption;
        this._helpCommand = sourceCommand._helpCommand;
        this._helpConfiguration = sourceCommand._helpConfiguration;
        this._exitCallback = sourceCommand._exitCallback;
        this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
        this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
        this._allowExcessArguments = sourceCommand._allowExcessArguments;
        this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
        this._showHelpAfterError = sourceCommand._showHelpAfterError;
        this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;
        return this;
      }
      /**
       * @returns {Command[]}
       * @private
       */
      _getCommandAndAncestors() {
        const result = [];
        for (let command = this; command; command = command.parent) {
          result.push(command);
        }
        return result;
      }
      /**
       * Define a command.
       *
       * There are two styles of command: pay attention to where to put the description.
       *
       * @example
       * // Command implemented using action handler (description is supplied separately to `.command`)
       * program
       *   .command('clone <source> [destination]')
       *   .description('clone a repository into a newly created directory')
       *   .action((source, destination) => {
       *     console.log('clone command called');
       *   });
       *
       * // Command implemented using separate executable file (description is second parameter to `.command`)
       * program
       *   .command('start <service>', 'start named service')
       *   .command('stop [service]', 'stop named service, or all if no name supplied');
       *
       * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
       * @param {(object | string)} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
       * @param {object} [execOpts] - configuration options (for executable)
       * @return {Command} returns new command for action handler, or `this` for executable command
       */
      command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
        let desc = actionOptsOrExecDesc;
        let opts = execOpts;
        if (typeof desc === "object" && desc !== null) {
          opts = desc;
          desc = null;
        }
        opts = opts || {};
        const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);
        const cmd = this.createCommand(name);
        if (desc) {
          cmd.description(desc);
          cmd._executableHandler = true;
        }
        if (opts.isDefault) this._defaultCommandName = cmd._name;
        cmd._hidden = !!(opts.noHelp || opts.hidden);
        cmd._executableFile = opts.executableFile || null;
        if (args) cmd.arguments(args);
        this._registerCommand(cmd);
        cmd.parent = this;
        cmd.copyInheritedSettings(this);
        if (desc) return this;
        return cmd;
      }
      /**
       * Factory routine to create a new unattached command.
       *
       * See .command() for creating an attached subcommand, which uses this routine to
       * create the command. You can override createCommand to customise subcommands.
       *
       * @param {string} [name]
       * @return {Command} new command
       */
      createCommand(name) {
        return new _Command(name);
      }
      /**
       * You can customise the help with a subclass of Help by overriding createHelp,
       * or by overriding Help properties using configureHelp().
       *
       * @return {Help}
       */
      createHelp() {
        return Object.assign(new Help2(), this.configureHelp());
      }
      /**
       * You can customise the help by overriding Help properties using configureHelp(),
       * or with a subclass of Help by overriding createHelp().
       *
       * @param {object} [configuration] - configuration options
       * @return {(Command | object)} `this` command for chaining, or stored configuration
       */
      configureHelp(configuration) {
        if (configuration === void 0) return this._helpConfiguration;
        this._helpConfiguration = configuration;
        return this;
      }
      /**
       * The default output goes to stdout and stderr. You can customise this for special
       * applications. You can also customise the display of errors by overriding outputError.
       *
       * The configuration properties are all functions:
       *
       *     // change how output being written, defaults to stdout and stderr
       *     writeOut(str)
       *     writeErr(str)
       *     // change how output being written for errors, defaults to writeErr
       *     outputError(str, write) // used for displaying errors and not used for displaying help
       *     // specify width for wrapping help
       *     getOutHelpWidth()
       *     getErrHelpWidth()
       *     // color support, currently only used with Help
       *     getOutHasColors()
       *     getErrHasColors()
       *     stripColor() // used to remove ANSI escape codes if output does not have colors
       *
       * @param {object} [configuration] - configuration options
       * @return {(Command | object)} `this` command for chaining, or stored configuration
       */
      configureOutput(configuration) {
        if (configuration === void 0) return this._outputConfiguration;
        Object.assign(this._outputConfiguration, configuration);
        return this;
      }
      /**
       * Display the help or a custom message after an error occurs.
       *
       * @param {(boolean|string)} [displayHelp]
       * @return {Command} `this` command for chaining
       */
      showHelpAfterError(displayHelp = true) {
        if (typeof displayHelp !== "string") displayHelp = !!displayHelp;
        this._showHelpAfterError = displayHelp;
        return this;
      }
      /**
       * Display suggestion of similar commands for unknown commands, or options for unknown options.
       *
       * @param {boolean} [displaySuggestion]
       * @return {Command} `this` command for chaining
       */
      showSuggestionAfterError(displaySuggestion = true) {
        this._showSuggestionAfterError = !!displaySuggestion;
        return this;
      }
      /**
       * Add a prepared subcommand.
       *
       * See .command() for creating an attached subcommand which inherits settings from its parent.
       *
       * @param {Command} cmd - new subcommand
       * @param {object} [opts] - configuration options
       * @return {Command} `this` command for chaining
       */
      addCommand(cmd, opts) {
        if (!cmd._name) {
          throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
        }
        opts = opts || {};
        if (opts.isDefault) this._defaultCommandName = cmd._name;
        if (opts.noHelp || opts.hidden) cmd._hidden = true;
        this._registerCommand(cmd);
        cmd.parent = this;
        cmd._checkForBrokenPassThrough();
        return this;
      }
      /**
       * Factory routine to create a new unattached argument.
       *
       * See .argument() for creating an attached argument, which uses this routine to
       * create the argument. You can override createArgument to return a custom argument.
       *
       * @param {string} name
       * @param {string} [description]
       * @return {Argument} new argument
       */
      createArgument(name, description) {
        return new Argument2(name, description);
      }
      /**
       * Define argument syntax for command.
       *
       * The default is that the argument is required, and you can explicitly
       * indicate this with <> around the name. Put [] around the name for an optional argument.
       *
       * @example
       * program.argument('<input-file>');
       * program.argument('[output-file]');
       *
       * @param {string} name
       * @param {string} [description]
       * @param {(Function|*)} [fn] - custom argument processing function
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      argument(name, description, fn, defaultValue) {
        const argument = this.createArgument(name, description);
        if (typeof fn === "function") {
          argument.default(defaultValue).argParser(fn);
        } else {
          argument.default(fn);
        }
        this.addArgument(argument);
        return this;
      }
      /**
       * Define argument syntax for command, adding multiple at once (without descriptions).
       *
       * See also .argument().
       *
       * @example
       * program.arguments('<cmd> [env]');
       *
       * @param {string} names
       * @return {Command} `this` command for chaining
       */
      arguments(names) {
        names.trim().split(/ +/).forEach((detail) => {
          this.argument(detail);
        });
        return this;
      }
      /**
       * Define argument syntax for command, adding a prepared argument.
       *
       * @param {Argument} argument
       * @return {Command} `this` command for chaining
       */
      addArgument(argument) {
        const previousArgument = this.registeredArguments.slice(-1)[0];
        if (previousArgument && previousArgument.variadic) {
          throw new Error(
            `only the last argument can be variadic '${previousArgument.name()}'`
          );
        }
        if (argument.required && argument.defaultValue !== void 0 && argument.parseArg === void 0) {
          throw new Error(
            `a default value for a required argument is never used: '${argument.name()}'`
          );
        }
        this.registeredArguments.push(argument);
        return this;
      }
      /**
       * Customise or override default help command. By default a help command is automatically added if your command has subcommands.
       *
       * @example
       *    program.helpCommand('help [cmd]');
       *    program.helpCommand('help [cmd]', 'show help');
       *    program.helpCommand(false); // suppress default help command
       *    program.helpCommand(true); // add help command even if no subcommands
       *
       * @param {string|boolean} enableOrNameAndArgs - enable with custom name and/or arguments, or boolean to override whether added
       * @param {string} [description] - custom description
       * @return {Command} `this` command for chaining
       */
      helpCommand(enableOrNameAndArgs, description) {
        if (typeof enableOrNameAndArgs === "boolean") {
          this._addImplicitHelpCommand = enableOrNameAndArgs;
          return this;
        }
        enableOrNameAndArgs = enableOrNameAndArgs ?? "help [command]";
        const [, helpName, helpArgs] = enableOrNameAndArgs.match(/([^ ]+) *(.*)/);
        const helpDescription = description ?? "display help for command";
        const helpCommand = this.createCommand(helpName);
        helpCommand.helpOption(false);
        if (helpArgs) helpCommand.arguments(helpArgs);
        if (helpDescription) helpCommand.description(helpDescription);
        this._addImplicitHelpCommand = true;
        this._helpCommand = helpCommand;
        return this;
      }
      /**
       * Add prepared custom help command.
       *
       * @param {(Command|string|boolean)} helpCommand - custom help command, or deprecated enableOrNameAndArgs as for `.helpCommand()`
       * @param {string} [deprecatedDescription] - deprecated custom description used with custom name only
       * @return {Command} `this` command for chaining
       */
      addHelpCommand(helpCommand, deprecatedDescription) {
        if (typeof helpCommand !== "object") {
          this.helpCommand(helpCommand, deprecatedDescription);
          return this;
        }
        this._addImplicitHelpCommand = true;
        this._helpCommand = helpCommand;
        return this;
      }
      /**
       * Lazy create help command.
       *
       * @return {(Command|null)}
       * @package
       */
      _getHelpCommand() {
        const hasImplicitHelpCommand = this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand("help"));
        if (hasImplicitHelpCommand) {
          if (this._helpCommand === void 0) {
            this.helpCommand(void 0, void 0);
          }
          return this._helpCommand;
        }
        return null;
      }
      /**
       * Add hook for life cycle event.
       *
       * @param {string} event
       * @param {Function} listener
       * @return {Command} `this` command for chaining
       */
      hook(event, listener) {
        const allowedValues = ["preSubcommand", "preAction", "postAction"];
        if (!allowedValues.includes(event)) {
          throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        if (this._lifeCycleHooks[event]) {
          this._lifeCycleHooks[event].push(listener);
        } else {
          this._lifeCycleHooks[event] = [listener];
        }
        return this;
      }
      /**
       * Register callback to use as replacement for calling process.exit.
       *
       * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
       * @return {Command} `this` command for chaining
       */
      exitOverride(fn) {
        if (fn) {
          this._exitCallback = fn;
        } else {
          this._exitCallback = (err) => {
            if (err.code !== "commander.executeSubCommandAsync") {
              throw err;
            } else {
            }
          };
        }
        return this;
      }
      /**
       * Call process.exit, and _exitCallback if defined.
       *
       * @param {number} exitCode exit code for using with process.exit
       * @param {string} code an id string representing the error
       * @param {string} message human-readable description of the error
       * @return never
       * @private
       */
      _exit(exitCode, code, message) {
        if (this._exitCallback) {
          this._exitCallback(new CommanderError2(exitCode, code, message));
        }
        process3.exit(exitCode);
      }
      /**
       * Register callback `fn` for the command.
       *
       * @example
       * program
       *   .command('serve')
       *   .description('start service')
       *   .action(function() {
       *      // do work here
       *   });
       *
       * @param {Function} fn
       * @return {Command} `this` command for chaining
       */
      action(fn) {
        const listener = (args) => {
          const expectedArgsCount = this.registeredArguments.length;
          const actionArgs = args.slice(0, expectedArgsCount);
          if (this._storeOptionsAsProperties) {
            actionArgs[expectedArgsCount] = this;
          } else {
            actionArgs[expectedArgsCount] = this.opts();
          }
          actionArgs.push(this);
          return fn.apply(this, actionArgs);
        };
        this._actionHandler = listener;
        return this;
      }
      /**
       * Factory routine to create a new unattached option.
       *
       * See .option() for creating an attached option, which uses this routine to
       * create the option. You can override createOption to return a custom option.
       *
       * @param {string} flags
       * @param {string} [description]
       * @return {Option} new option
       */
      createOption(flags, description) {
        return new Option2(flags, description);
      }
      /**
       * Wrap parseArgs to catch 'commander.invalidArgument'.
       *
       * @param {(Option | Argument)} target
       * @param {string} value
       * @param {*} previous
       * @param {string} invalidArgumentMessage
       * @private
       */
      _callParseArg(target, value, previous, invalidArgumentMessage) {
        try {
          return target.parseArg(value, previous);
        } catch (err) {
          if (err.code === "commander.invalidArgument") {
            const message = `${invalidArgumentMessage} ${err.message}`;
            this.error(message, { exitCode: err.exitCode, code: err.code });
          }
          throw err;
        }
      }
      /**
       * Check for option flag conflicts.
       * Register option if no conflicts found, or throw on conflict.
       *
       * @param {Option} option
       * @private
       */
      _registerOption(option) {
        const matchingOption = option.short && this._findOption(option.short) || option.long && this._findOption(option.long);
        if (matchingOption) {
          const matchingFlag = option.long && this._findOption(option.long) ? option.long : option.short;
          throw new Error(`Cannot add option '${option.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${matchingFlag}'
-  already used by option '${matchingOption.flags}'`);
        }
        this.options.push(option);
      }
      /**
       * Check for command name and alias conflicts with existing commands.
       * Register command if no conflicts found, or throw on conflict.
       *
       * @param {Command} command
       * @private
       */
      _registerCommand(command) {
        const knownBy = (cmd) => {
          return [cmd.name()].concat(cmd.aliases());
        };
        const alreadyUsed = knownBy(command).find(
          (name) => this._findCommand(name)
        );
        if (alreadyUsed) {
          const existingCmd = knownBy(this._findCommand(alreadyUsed)).join("|");
          const newCmd = knownBy(command).join("|");
          throw new Error(
            `cannot add command '${newCmd}' as already have command '${existingCmd}'`
          );
        }
        this.commands.push(command);
      }
      /**
       * Add an option.
       *
       * @param {Option} option
       * @return {Command} `this` command for chaining
       */
      addOption(option) {
        this._registerOption(option);
        const oname = option.name();
        const name = option.attributeName();
        if (option.negate) {
          const positiveLongFlag = option.long.replace(/^--no-/, "--");
          if (!this._findOption(positiveLongFlag)) {
            this.setOptionValueWithSource(
              name,
              option.defaultValue === void 0 ? true : option.defaultValue,
              "default"
            );
          }
        } else if (option.defaultValue !== void 0) {
          this.setOptionValueWithSource(name, option.defaultValue, "default");
        }
        const handleOptionValue = (val, invalidValueMessage, valueSource) => {
          if (val == null && option.presetArg !== void 0) {
            val = option.presetArg;
          }
          const oldValue = this.getOptionValue(name);
          if (val !== null && option.parseArg) {
            val = this._callParseArg(option, val, oldValue, invalidValueMessage);
          } else if (val !== null && option.variadic) {
            val = option._concatValue(val, oldValue);
          }
          if (val == null) {
            if (option.negate) {
              val = false;
            } else if (option.isBoolean() || option.optional) {
              val = true;
            } else {
              val = "";
            }
          }
          this.setOptionValueWithSource(name, val, valueSource);
        };
        this.on("option:" + oname, (val) => {
          const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
          handleOptionValue(val, invalidValueMessage, "cli");
        });
        if (option.envVar) {
          this.on("optionEnv:" + oname, (val) => {
            const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
            handleOptionValue(val, invalidValueMessage, "env");
          });
        }
        return this;
      }
      /**
       * Internal implementation shared by .option() and .requiredOption()
       *
       * @return {Command} `this` command for chaining
       * @private
       */
      _optionEx(config, flags, description, fn, defaultValue) {
        if (typeof flags === "object" && flags instanceof Option2) {
          throw new Error(
            "To add an Option object use addOption() instead of option() or requiredOption()"
          );
        }
        const option = this.createOption(flags, description);
        option.makeOptionMandatory(!!config.mandatory);
        if (typeof fn === "function") {
          option.default(defaultValue).argParser(fn);
        } else if (fn instanceof RegExp) {
          const regex = fn;
          fn = (val, def) => {
            const m = regex.exec(val);
            return m ? m[0] : def;
          };
          option.default(defaultValue).argParser(fn);
        } else {
          option.default(fn);
        }
        return this.addOption(option);
      }
      /**
       * Define option with `flags`, `description`, and optional argument parsing function or `defaultValue` or both.
       *
       * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space. A required
       * option-argument is indicated by `<>` and an optional option-argument by `[]`.
       *
       * See the README for more details, and see also addOption() and requiredOption().
       *
       * @example
       * program
       *     .option('-p, --pepper', 'add pepper')
       *     .option('--pt, --pizza-type <TYPE>', 'type of pizza') // required option-argument
       *     .option('-c, --cheese [CHEESE]', 'add extra cheese', 'mozzarella') // optional option-argument with default
       *     .option('-t, --tip <VALUE>', 'add tip to purchase cost', parseFloat) // custom parse function
       *
       * @param {string} flags
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom option processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      option(flags, description, parseArg, defaultValue) {
        return this._optionEx({}, flags, description, parseArg, defaultValue);
      }
      /**
       * Add a required option which must have a value after parsing. This usually means
       * the option must be specified on the command line. (Otherwise the same as .option().)
       *
       * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
       *
       * @param {string} flags
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom option processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      requiredOption(flags, description, parseArg, defaultValue) {
        return this._optionEx(
          { mandatory: true },
          flags,
          description,
          parseArg,
          defaultValue
        );
      }
      /**
       * Alter parsing of short flags with optional values.
       *
       * @example
       * // for `.option('-f,--flag [value]'):
       * program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
       * program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
       *
       * @param {boolean} [combine] - if `true` or omitted, an optional value can be specified directly after the flag.
       * @return {Command} `this` command for chaining
       */
      combineFlagAndOptionalValue(combine = true) {
        this._combineFlagAndOptionalValue = !!combine;
        return this;
      }
      /**
       * Allow unknown options on the command line.
       *
       * @param {boolean} [allowUnknown] - if `true` or omitted, no error will be thrown for unknown options.
       * @return {Command} `this` command for chaining
       */
      allowUnknownOption(allowUnknown = true) {
        this._allowUnknownOption = !!allowUnknown;
        return this;
      }
      /**
       * Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
       *
       * @param {boolean} [allowExcess] - if `true` or omitted, no error will be thrown for excess arguments.
       * @return {Command} `this` command for chaining
       */
      allowExcessArguments(allowExcess = true) {
        this._allowExcessArguments = !!allowExcess;
        return this;
      }
      /**
       * Enable positional options. Positional means global options are specified before subcommands which lets
       * subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
       * The default behaviour is non-positional and global options may appear anywhere on the command line.
       *
       * @param {boolean} [positional]
       * @return {Command} `this` command for chaining
       */
      enablePositionalOptions(positional = true) {
        this._enablePositionalOptions = !!positional;
        return this;
      }
      /**
       * Pass through options that come after command-arguments rather than treat them as command-options,
       * so actual command-options come before command-arguments. Turning this on for a subcommand requires
       * positional options to have been enabled on the program (parent commands).
       * The default behaviour is non-positional and options may appear before or after command-arguments.
       *
       * @param {boolean} [passThrough] for unknown options.
       * @return {Command} `this` command for chaining
       */
      passThroughOptions(passThrough = true) {
        this._passThroughOptions = !!passThrough;
        this._checkForBrokenPassThrough();
        return this;
      }
      /**
       * @private
       */
      _checkForBrokenPassThrough() {
        if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions) {
          throw new Error(
            `passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`
          );
        }
      }
      /**
       * Whether to store option values as properties on command object,
       * or store separately (specify false). In both cases the option values can be accessed using .opts().
       *
       * @param {boolean} [storeAsProperties=true]
       * @return {Command} `this` command for chaining
       */
      storeOptionsAsProperties(storeAsProperties = true) {
        if (this.options.length) {
          throw new Error("call .storeOptionsAsProperties() before adding options");
        }
        if (Object.keys(this._optionValues).length) {
          throw new Error(
            "call .storeOptionsAsProperties() before setting option values"
          );
        }
        this._storeOptionsAsProperties = !!storeAsProperties;
        return this;
      }
      /**
       * Retrieve option value.
       *
       * @param {string} key
       * @return {object} value
       */
      getOptionValue(key) {
        if (this._storeOptionsAsProperties) {
          return this[key];
        }
        return this._optionValues[key];
      }
      /**
       * Store option value.
       *
       * @param {string} key
       * @param {object} value
       * @return {Command} `this` command for chaining
       */
      setOptionValue(key, value) {
        return this.setOptionValueWithSource(key, value, void 0);
      }
      /**
       * Store option value and where the value came from.
       *
       * @param {string} key
       * @param {object} value
       * @param {string} source - expected values are default/config/env/cli/implied
       * @return {Command} `this` command for chaining
       */
      setOptionValueWithSource(key, value, source) {
        if (this._storeOptionsAsProperties) {
          this[key] = value;
        } else {
          this._optionValues[key] = value;
        }
        this._optionValueSources[key] = source;
        return this;
      }
      /**
       * Get source of option value.
       * Expected values are default | config | env | cli | implied
       *
       * @param {string} key
       * @return {string}
       */
      getOptionValueSource(key) {
        return this._optionValueSources[key];
      }
      /**
       * Get source of option value. See also .optsWithGlobals().
       * Expected values are default | config | env | cli | implied
       *
       * @param {string} key
       * @return {string}
       */
      getOptionValueSourceWithGlobals(key) {
        let source;
        this._getCommandAndAncestors().forEach((cmd) => {
          if (cmd.getOptionValueSource(key) !== void 0) {
            source = cmd.getOptionValueSource(key);
          }
        });
        return source;
      }
      /**
       * Get user arguments from implied or explicit arguments.
       * Side-effects: set _scriptPath if args included script. Used for default program name, and subcommand searches.
       *
       * @private
       */
      _prepareUserArgs(argv, parseOptions) {
        if (argv !== void 0 && !Array.isArray(argv)) {
          throw new Error("first parameter to parse must be array or undefined");
        }
        parseOptions = parseOptions || {};
        if (argv === void 0 && parseOptions.from === void 0) {
          if (process3.versions?.electron) {
            parseOptions.from = "electron";
          }
          const execArgv = process3.execArgv ?? [];
          if (execArgv.includes("-e") || execArgv.includes("--eval") || execArgv.includes("-p") || execArgv.includes("--print")) {
            parseOptions.from = "eval";
          }
        }
        if (argv === void 0) {
          argv = process3.argv;
        }
        this.rawArgs = argv.slice();
        let userArgs;
        switch (parseOptions.from) {
          case void 0:
          case "node":
            this._scriptPath = argv[1];
            userArgs = argv.slice(2);
            break;
          case "electron":
            if (process3.defaultApp) {
              this._scriptPath = argv[1];
              userArgs = argv.slice(2);
            } else {
              userArgs = argv.slice(1);
            }
            break;
          case "user":
            userArgs = argv.slice(0);
            break;
          case "eval":
            userArgs = argv.slice(1);
            break;
          default:
            throw new Error(
              `unexpected parse option { from: '${parseOptions.from}' }`
            );
        }
        if (!this._name && this._scriptPath)
          this.nameFromFilename(this._scriptPath);
        this._name = this._name || "program";
        return userArgs;
      }
      /**
       * Parse `argv`, setting options and invoking commands when defined.
       *
       * Use parseAsync instead of parse if any of your action handlers are async.
       *
       * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
       *
       * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
       * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
       * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
       * - `'user'`: just user arguments
       *
       * @example
       * program.parse(); // parse process.argv and auto-detect electron and special node flags
       * program.parse(process.argv); // assume argv[0] is app and argv[1] is script
       * program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
       *
       * @param {string[]} [argv] - optional, defaults to process.argv
       * @param {object} [parseOptions] - optionally specify style of options with from: node/user/electron
       * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
       * @return {Command} `this` command for chaining
       */
      parse(argv, parseOptions) {
        this._prepareForParse();
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        this._parseCommand([], userArgs);
        return this;
      }
      /**
       * Parse `argv`, setting options and invoking commands when defined.
       *
       * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
       *
       * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
       * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
       * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
       * - `'user'`: just user arguments
       *
       * @example
       * await program.parseAsync(); // parse process.argv and auto-detect electron and special node flags
       * await program.parseAsync(process.argv); // assume argv[0] is app and argv[1] is script
       * await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
       *
       * @param {string[]} [argv]
       * @param {object} [parseOptions]
       * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
       * @return {Promise}
       */
      async parseAsync(argv, parseOptions) {
        this._prepareForParse();
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        await this._parseCommand([], userArgs);
        return this;
      }
      _prepareForParse() {
        if (this._savedState === null) {
          this.saveStateBeforeParse();
        } else {
          this.restoreStateBeforeParse();
        }
      }
      /**
       * Called the first time parse is called to save state and allow a restore before subsequent calls to parse.
       * Not usually called directly, but available for subclasses to save their custom state.
       *
       * This is called in a lazy way. Only commands used in parsing chain will have state saved.
       */
      saveStateBeforeParse() {
        this._savedState = {
          // name is stable if supplied by author, but may be unspecified for root command and deduced during parsing
          _name: this._name,
          // option values before parse have default values (including false for negated options)
          // shallow clones
          _optionValues: { ...this._optionValues },
          _optionValueSources: { ...this._optionValueSources }
        };
      }
      /**
       * Restore state before parse for calls after the first.
       * Not usually called directly, but available for subclasses to save their custom state.
       *
       * This is called in a lazy way. Only commands used in parsing chain will have state restored.
       */
      restoreStateBeforeParse() {
        if (this._storeOptionsAsProperties)
          throw new Error(`Can not call parse again when storeOptionsAsProperties is true.
- either make a new Command for each call to parse, or stop storing options as properties`);
        this._name = this._savedState._name;
        this._scriptPath = null;
        this.rawArgs = [];
        this._optionValues = { ...this._savedState._optionValues };
        this._optionValueSources = { ...this._savedState._optionValueSources };
        this.args = [];
        this.processedArgs = [];
      }
      /**
       * Throw if expected executable is missing. Add lots of help for author.
       *
       * @param {string} executableFile
       * @param {string} executableDir
       * @param {string} subcommandName
       */
      _checkForMissingExecutable(executableFile, executableDir, subcommandName) {
        if (fs4.existsSync(executableFile)) return;
        const executableDirMessage = executableDir ? `searched for local subcommand relative to directory '${executableDir}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory";
        const executableMissing = `'${executableFile}' does not exist
 - if '${subcommandName}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
        throw new Error(executableMissing);
      }
      /**
       * Execute a sub-command executable.
       *
       * @private
       */
      _executeSubCommand(subcommand, args) {
        args = args.slice();
        let launchWithNode = false;
        const sourceExt = [".js", ".ts", ".tsx", ".mjs", ".cjs"];
        function findFile(baseDir, baseName) {
          const localBin = path4.resolve(baseDir, baseName);
          if (fs4.existsSync(localBin)) return localBin;
          if (sourceExt.includes(path4.extname(baseName))) return void 0;
          const foundExt = sourceExt.find(
            (ext) => fs4.existsSync(`${localBin}${ext}`)
          );
          if (foundExt) return `${localBin}${foundExt}`;
          return void 0;
        }
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
        let executableDir = this._executableDir || "";
        if (this._scriptPath) {
          let resolvedScriptPath;
          try {
            resolvedScriptPath = fs4.realpathSync(this._scriptPath);
          } catch {
            resolvedScriptPath = this._scriptPath;
          }
          executableDir = path4.resolve(
            path4.dirname(resolvedScriptPath),
            executableDir
          );
        }
        if (executableDir) {
          let localFile = findFile(executableDir, executableFile);
          if (!localFile && !subcommand._executableFile && this._scriptPath) {
            const legacyName = path4.basename(
              this._scriptPath,
              path4.extname(this._scriptPath)
            );
            if (legacyName !== this._name) {
              localFile = findFile(
                executableDir,
                `${legacyName}-${subcommand._name}`
              );
            }
          }
          executableFile = localFile || executableFile;
        }
        launchWithNode = sourceExt.includes(path4.extname(executableFile));
        let proc;
        if (process3.platform !== "win32") {
          if (launchWithNode) {
            args.unshift(executableFile);
            args = incrementNodeInspectorPort(process3.execArgv).concat(args);
            proc = childProcess.spawn(process3.argv[0], args, { stdio: "inherit" });
          } else {
            proc = childProcess.spawn(executableFile, args, { stdio: "inherit" });
          }
        } else {
          this._checkForMissingExecutable(
            executableFile,
            executableDir,
            subcommand._name
          );
          args.unshift(executableFile);
          args = incrementNodeInspectorPort(process3.execArgv).concat(args);
          proc = childProcess.spawn(process3.execPath, args, { stdio: "inherit" });
        }
        if (!proc.killed) {
          const signals = ["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"];
          signals.forEach((signal) => {
            process3.on(signal, () => {
              if (proc.killed === false && proc.exitCode === null) {
                proc.kill(signal);
              }
            });
          });
        }
        const exitCallback = this._exitCallback;
        proc.on("close", (code) => {
          code = code ?? 1;
          if (!exitCallback) {
            process3.exit(code);
          } else {
            exitCallback(
              new CommanderError2(
                code,
                "commander.executeSubCommandAsync",
                "(close)"
              )
            );
          }
        });
        proc.on("error", (err) => {
          if (err.code === "ENOENT") {
            this._checkForMissingExecutable(
              executableFile,
              executableDir,
              subcommand._name
            );
          } else if (err.code === "EACCES") {
            throw new Error(`'${executableFile}' not executable`);
          }
          if (!exitCallback) {
            process3.exit(1);
          } else {
            const wrappedError = new CommanderError2(
              1,
              "commander.executeSubCommandAsync",
              "(error)"
            );
            wrappedError.nestedError = err;
            exitCallback(wrappedError);
          }
        });
        this.runningCommand = proc;
      }
      /**
       * @private
       */
      _dispatchSubcommand(commandName, operands, unknown) {
        const subCommand = this._findCommand(commandName);
        if (!subCommand) this.help({ error: true });
        subCommand._prepareForParse();
        let promiseChain;
        promiseChain = this._chainOrCallSubCommandHook(
          promiseChain,
          subCommand,
          "preSubcommand"
        );
        promiseChain = this._chainOrCall(promiseChain, () => {
          if (subCommand._executableHandler) {
            this._executeSubCommand(subCommand, operands.concat(unknown));
          } else {
            return subCommand._parseCommand(operands, unknown);
          }
        });
        return promiseChain;
      }
      /**
       * Invoke help directly if possible, or dispatch if necessary.
       * e.g. help foo
       *
       * @private
       */
      _dispatchHelpCommand(subcommandName) {
        if (!subcommandName) {
          this.help();
        }
        const subCommand = this._findCommand(subcommandName);
        if (subCommand && !subCommand._executableHandler) {
          subCommand.help();
        }
        return this._dispatchSubcommand(
          subcommandName,
          [],
          [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"]
        );
      }
      /**
       * Check this.args against expected this.registeredArguments.
       *
       * @private
       */
      _checkNumberOfArguments() {
        this.registeredArguments.forEach((arg, i) => {
          if (arg.required && this.args[i] == null) {
            this.missingArgument(arg.name());
          }
        });
        if (this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic) {
          return;
        }
        if (this.args.length > this.registeredArguments.length) {
          this._excessArguments(this.args);
        }
      }
      /**
       * Process this.args using this.registeredArguments and save as this.processedArgs!
       *
       * @private
       */
      _processArguments() {
        const myParseArg = (argument, value, previous) => {
          let parsedValue = value;
          if (value !== null && argument.parseArg) {
            const invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'.`;
            parsedValue = this._callParseArg(
              argument,
              value,
              previous,
              invalidValueMessage
            );
          }
          return parsedValue;
        };
        this._checkNumberOfArguments();
        const processedArgs = [];
        this.registeredArguments.forEach((declaredArg, index) => {
          let value = declaredArg.defaultValue;
          if (declaredArg.variadic) {
            if (index < this.args.length) {
              value = this.args.slice(index);
              if (declaredArg.parseArg) {
                value = value.reduce((processed, v) => {
                  return myParseArg(declaredArg, v, processed);
                }, declaredArg.defaultValue);
              }
            } else if (value === void 0) {
              value = [];
            }
          } else if (index < this.args.length) {
            value = this.args[index];
            if (declaredArg.parseArg) {
              value = myParseArg(declaredArg, value, declaredArg.defaultValue);
            }
          }
          processedArgs[index] = value;
        });
        this.processedArgs = processedArgs;
      }
      /**
       * Once we have a promise we chain, but call synchronously until then.
       *
       * @param {(Promise|undefined)} promise
       * @param {Function} fn
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCall(promise, fn) {
        if (promise && promise.then && typeof promise.then === "function") {
          return promise.then(() => fn());
        }
        return fn();
      }
      /**
       *
       * @param {(Promise|undefined)} promise
       * @param {string} event
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCallHooks(promise, event) {
        let result = promise;
        const hooks = [];
        this._getCommandAndAncestors().reverse().filter((cmd) => cmd._lifeCycleHooks[event] !== void 0).forEach((hookedCommand) => {
          hookedCommand._lifeCycleHooks[event].forEach((callback) => {
            hooks.push({ hookedCommand, callback });
          });
        });
        if (event === "postAction") {
          hooks.reverse();
        }
        hooks.forEach((hookDetail) => {
          result = this._chainOrCall(result, () => {
            return hookDetail.callback(hookDetail.hookedCommand, this);
          });
        });
        return result;
      }
      /**
       *
       * @param {(Promise|undefined)} promise
       * @param {Command} subCommand
       * @param {string} event
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCallSubCommandHook(promise, subCommand, event) {
        let result = promise;
        if (this._lifeCycleHooks[event] !== void 0) {
          this._lifeCycleHooks[event].forEach((hook) => {
            result = this._chainOrCall(result, () => {
              return hook(this, subCommand);
            });
          });
        }
        return result;
      }
      /**
       * Process arguments in context of this command.
       * Returns action result, in case it is a promise.
       *
       * @private
       */
      _parseCommand(operands, unknown) {
        const parsed = this.parseOptions(unknown);
        this._parseOptionsEnv();
        this._parseOptionsImplied();
        operands = operands.concat(parsed.operands);
        unknown = parsed.unknown;
        this.args = operands.concat(unknown);
        if (operands && this._findCommand(operands[0])) {
          return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
        }
        if (this._getHelpCommand() && operands[0] === this._getHelpCommand().name()) {
          return this._dispatchHelpCommand(operands[1]);
        }
        if (this._defaultCommandName) {
          this._outputHelpIfRequested(unknown);
          return this._dispatchSubcommand(
            this._defaultCommandName,
            operands,
            unknown
          );
        }
        if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
          this.help({ error: true });
        }
        this._outputHelpIfRequested(parsed.unknown);
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        const checkForUnknownOptions = () => {
          if (parsed.unknown.length > 0) {
            this.unknownOption(parsed.unknown[0]);
          }
        };
        const commandEvent = `command:${this.name()}`;
        if (this._actionHandler) {
          checkForUnknownOptions();
          this._processArguments();
          let promiseChain;
          promiseChain = this._chainOrCallHooks(promiseChain, "preAction");
          promiseChain = this._chainOrCall(
            promiseChain,
            () => this._actionHandler(this.processedArgs)
          );
          if (this.parent) {
            promiseChain = this._chainOrCall(promiseChain, () => {
              this.parent.emit(commandEvent, operands, unknown);
            });
          }
          promiseChain = this._chainOrCallHooks(promiseChain, "postAction");
          return promiseChain;
        }
        if (this.parent && this.parent.listenerCount(commandEvent)) {
          checkForUnknownOptions();
          this._processArguments();
          this.parent.emit(commandEvent, operands, unknown);
        } else if (operands.length) {
          if (this._findCommand("*")) {
            return this._dispatchSubcommand("*", operands, unknown);
          }
          if (this.listenerCount("command:*")) {
            this.emit("command:*", operands, unknown);
          } else if (this.commands.length) {
            this.unknownCommand();
          } else {
            checkForUnknownOptions();
            this._processArguments();
          }
        } else if (this.commands.length) {
          checkForUnknownOptions();
          this.help({ error: true });
        } else {
          checkForUnknownOptions();
          this._processArguments();
        }
      }
      /**
       * Find matching command.
       *
       * @private
       * @return {Command | undefined}
       */
      _findCommand(name) {
        if (!name) return void 0;
        return this.commands.find(
          (cmd) => cmd._name === name || cmd._aliases.includes(name)
        );
      }
      /**
       * Return an option matching `arg` if any.
       *
       * @param {string} arg
       * @return {Option}
       * @package
       */
      _findOption(arg) {
        return this.options.find((option) => option.is(arg));
      }
      /**
       * Display an error message if a mandatory option does not have a value.
       * Called after checking for help flags in leaf subcommand.
       *
       * @private
       */
      _checkForMissingMandatoryOptions() {
        this._getCommandAndAncestors().forEach((cmd) => {
          cmd.options.forEach((anOption) => {
            if (anOption.mandatory && cmd.getOptionValue(anOption.attributeName()) === void 0) {
              cmd.missingMandatoryOptionValue(anOption);
            }
          });
        });
      }
      /**
       * Display an error message if conflicting options are used together in this.
       *
       * @private
       */
      _checkForConflictingLocalOptions() {
        const definedNonDefaultOptions = this.options.filter((option) => {
          const optionKey = option.attributeName();
          if (this.getOptionValue(optionKey) === void 0) {
            return false;
          }
          return this.getOptionValueSource(optionKey) !== "default";
        });
        const optionsWithConflicting = definedNonDefaultOptions.filter(
          (option) => option.conflictsWith.length > 0
        );
        optionsWithConflicting.forEach((option) => {
          const conflictingAndDefined = definedNonDefaultOptions.find(
            (defined) => option.conflictsWith.includes(defined.attributeName())
          );
          if (conflictingAndDefined) {
            this._conflictingOption(option, conflictingAndDefined);
          }
        });
      }
      /**
       * Display an error message if conflicting options are used together.
       * Called after checking for help flags in leaf subcommand.
       *
       * @private
       */
      _checkForConflictingOptions() {
        this._getCommandAndAncestors().forEach((cmd) => {
          cmd._checkForConflictingLocalOptions();
        });
      }
      /**
       * Parse options from `argv` removing known options,
       * and return argv split into operands and unknown arguments.
       *
       * Side effects: modifies command by storing options. Does not reset state if called again.
       *
       * Examples:
       *
       *     argv => operands, unknown
       *     --known kkk op => [op], []
       *     op --known kkk => [op], []
       *     sub --unknown uuu op => [sub], [--unknown uuu op]
       *     sub -- --unknown uuu op => [sub --unknown uuu op], []
       *
       * @param {string[]} argv
       * @return {{operands: string[], unknown: string[]}}
       */
      parseOptions(argv) {
        const operands = [];
        const unknown = [];
        let dest = operands;
        const args = argv.slice();
        function maybeOption(arg) {
          return arg.length > 1 && arg[0] === "-";
        }
        let activeVariadicOption = null;
        while (args.length) {
          const arg = args.shift();
          if (arg === "--") {
            if (dest === unknown) dest.push(arg);
            dest.push(...args);
            break;
          }
          if (activeVariadicOption && !maybeOption(arg)) {
            this.emit(`option:${activeVariadicOption.name()}`, arg);
            continue;
          }
          activeVariadicOption = null;
          if (maybeOption(arg)) {
            const option = this._findOption(arg);
            if (option) {
              if (option.required) {
                const value = args.shift();
                if (value === void 0) this.optionMissingArgument(option);
                this.emit(`option:${option.name()}`, value);
              } else if (option.optional) {
                let value = null;
                if (args.length > 0 && !maybeOption(args[0])) {
                  value = args.shift();
                }
                this.emit(`option:${option.name()}`, value);
              } else {
                this.emit(`option:${option.name()}`);
              }
              activeVariadicOption = option.variadic ? option : null;
              continue;
            }
          }
          if (arg.length > 2 && arg[0] === "-" && arg[1] !== "-") {
            const option = this._findOption(`-${arg[1]}`);
            if (option) {
              if (option.required || option.optional && this._combineFlagAndOptionalValue) {
                this.emit(`option:${option.name()}`, arg.slice(2));
              } else {
                this.emit(`option:${option.name()}`);
                args.unshift(`-${arg.slice(2)}`);
              }
              continue;
            }
          }
          if (/^--[^=]+=/.test(arg)) {
            const index = arg.indexOf("=");
            const option = this._findOption(arg.slice(0, index));
            if (option && (option.required || option.optional)) {
              this.emit(`option:${option.name()}`, arg.slice(index + 1));
              continue;
            }
          }
          if (maybeOption(arg)) {
            dest = unknown;
          }
          if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
            if (this._findCommand(arg)) {
              operands.push(arg);
              if (args.length > 0) unknown.push(...args);
              break;
            } else if (this._getHelpCommand() && arg === this._getHelpCommand().name()) {
              operands.push(arg);
              if (args.length > 0) operands.push(...args);
              break;
            } else if (this._defaultCommandName) {
              unknown.push(arg);
              if (args.length > 0) unknown.push(...args);
              break;
            }
          }
          if (this._passThroughOptions) {
            dest.push(arg);
            if (args.length > 0) dest.push(...args);
            break;
          }
          dest.push(arg);
        }
        return { operands, unknown };
      }
      /**
       * Return an object containing local option values as key-value pairs.
       *
       * @return {object}
       */
      opts() {
        if (this._storeOptionsAsProperties) {
          const result = {};
          const len = this.options.length;
          for (let i = 0; i < len; i++) {
            const key = this.options[i].attributeName();
            result[key] = key === this._versionOptionName ? this._version : this[key];
          }
          return result;
        }
        return this._optionValues;
      }
      /**
       * Return an object containing merged local and global option values as key-value pairs.
       *
       * @return {object}
       */
      optsWithGlobals() {
        return this._getCommandAndAncestors().reduce(
          (combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()),
          {}
        );
      }
      /**
       * Display error message and exit (or call exitOverride).
       *
       * @param {string} message
       * @param {object} [errorOptions]
       * @param {string} [errorOptions.code] - an id string representing the error
       * @param {number} [errorOptions.exitCode] - used with process.exit
       */
      error(message, errorOptions) {
        this._outputConfiguration.outputError(
          `${message}
`,
          this._outputConfiguration.writeErr
        );
        if (typeof this._showHelpAfterError === "string") {
          this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
        } else if (this._showHelpAfterError) {
          this._outputConfiguration.writeErr("\n");
          this.outputHelp({ error: true });
        }
        const config = errorOptions || {};
        const exitCode = config.exitCode || 1;
        const code = config.code || "commander.error";
        this._exit(exitCode, code, message);
      }
      /**
       * Apply any option related environment variables, if option does
       * not have a value from cli or client code.
       *
       * @private
       */
      _parseOptionsEnv() {
        this.options.forEach((option) => {
          if (option.envVar && option.envVar in process3.env) {
            const optionKey = option.attributeName();
            if (this.getOptionValue(optionKey) === void 0 || ["default", "config", "env"].includes(
              this.getOptionValueSource(optionKey)
            )) {
              if (option.required || option.optional) {
                this.emit(`optionEnv:${option.name()}`, process3.env[option.envVar]);
              } else {
                this.emit(`optionEnv:${option.name()}`);
              }
            }
          }
        });
      }
      /**
       * Apply any implied option values, if option is undefined or default value.
       *
       * @private
       */
      _parseOptionsImplied() {
        const dualHelper = new DualOptions(this.options);
        const hasCustomOptionValue = (optionKey) => {
          return this.getOptionValue(optionKey) !== void 0 && !["default", "implied"].includes(this.getOptionValueSource(optionKey));
        };
        this.options.filter(
          (option) => option.implied !== void 0 && hasCustomOptionValue(option.attributeName()) && dualHelper.valueFromOption(
            this.getOptionValue(option.attributeName()),
            option
          )
        ).forEach((option) => {
          Object.keys(option.implied).filter((impliedKey) => !hasCustomOptionValue(impliedKey)).forEach((impliedKey) => {
            this.setOptionValueWithSource(
              impliedKey,
              option.implied[impliedKey],
              "implied"
            );
          });
        });
      }
      /**
       * Argument `name` is missing.
       *
       * @param {string} name
       * @private
       */
      missingArgument(name) {
        const message = `error: missing required argument '${name}'`;
        this.error(message, { code: "commander.missingArgument" });
      }
      /**
       * `Option` is missing an argument.
       *
       * @param {Option} option
       * @private
       */
      optionMissingArgument(option) {
        const message = `error: option '${option.flags}' argument missing`;
        this.error(message, { code: "commander.optionMissingArgument" });
      }
      /**
       * `Option` does not have a value, and is a mandatory option.
       *
       * @param {Option} option
       * @private
       */
      missingMandatoryOptionValue(option) {
        const message = `error: required option '${option.flags}' not specified`;
        this.error(message, { code: "commander.missingMandatoryOptionValue" });
      }
      /**
       * `Option` conflicts with another option.
       *
       * @param {Option} option
       * @param {Option} conflictingOption
       * @private
       */
      _conflictingOption(option, conflictingOption) {
        const findBestOptionFromValue = (option2) => {
          const optionKey = option2.attributeName();
          const optionValue = this.getOptionValue(optionKey);
          const negativeOption = this.options.find(
            (target) => target.negate && optionKey === target.attributeName()
          );
          const positiveOption = this.options.find(
            (target) => !target.negate && optionKey === target.attributeName()
          );
          if (negativeOption && (negativeOption.presetArg === void 0 && optionValue === false || negativeOption.presetArg !== void 0 && optionValue === negativeOption.presetArg)) {
            return negativeOption;
          }
          return positiveOption || option2;
        };
        const getErrorMessage = (option2) => {
          const bestOption = findBestOptionFromValue(option2);
          const optionKey = bestOption.attributeName();
          const source = this.getOptionValueSource(optionKey);
          if (source === "env") {
            return `environment variable '${bestOption.envVar}'`;
          }
          return `option '${bestOption.flags}'`;
        };
        const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
        this.error(message, { code: "commander.conflictingOption" });
      }
      /**
       * Unknown option `flag`.
       *
       * @param {string} flag
       * @private
       */
      unknownOption(flag) {
        if (this._allowUnknownOption) return;
        let suggestion = "";
        if (flag.startsWith("--") && this._showSuggestionAfterError) {
          let candidateFlags = [];
          let command = this;
          do {
            const moreFlags = command.createHelp().visibleOptions(command).filter((option) => option.long).map((option) => option.long);
            candidateFlags = candidateFlags.concat(moreFlags);
            command = command.parent;
          } while (command && !command._enablePositionalOptions);
          suggestion = suggestSimilar(flag, candidateFlags);
        }
        const message = `error: unknown option '${flag}'${suggestion}`;
        this.error(message, { code: "commander.unknownOption" });
      }
      /**
       * Excess arguments, more than expected.
       *
       * @param {string[]} receivedArgs
       * @private
       */
      _excessArguments(receivedArgs) {
        if (this._allowExcessArguments) return;
        const expected = this.registeredArguments.length;
        const s = expected === 1 ? "" : "s";
        const forSubcommand = this.parent ? ` for '${this.name()}'` : "";
        const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
        this.error(message, { code: "commander.excessArguments" });
      }
      /**
       * Unknown command.
       *
       * @private
       */
      unknownCommand() {
        const unknownName = this.args[0];
        let suggestion = "";
        if (this._showSuggestionAfterError) {
          const candidateNames = [];
          this.createHelp().visibleCommands(this).forEach((command) => {
            candidateNames.push(command.name());
            if (command.alias()) candidateNames.push(command.alias());
          });
          suggestion = suggestSimilar(unknownName, candidateNames);
        }
        const message = `error: unknown command '${unknownName}'${suggestion}`;
        this.error(message, { code: "commander.unknownCommand" });
      }
      /**
       * Get or set the program version.
       *
       * This method auto-registers the "-V, --version" option which will print the version number.
       *
       * You can optionally supply the flags and description to override the defaults.
       *
       * @param {string} [str]
       * @param {string} [flags]
       * @param {string} [description]
       * @return {(this | string | undefined)} `this` command for chaining, or version string if no arguments
       */
      version(str, flags, description) {
        if (str === void 0) return this._version;
        this._version = str;
        flags = flags || "-V, --version";
        description = description || "output the version number";
        const versionOption = this.createOption(flags, description);
        this._versionOptionName = versionOption.attributeName();
        this._registerOption(versionOption);
        this.on("option:" + versionOption.name(), () => {
          this._outputConfiguration.writeOut(`${str}
`);
          this._exit(0, "commander.version", str);
        });
        return this;
      }
      /**
       * Set the description.
       *
       * @param {string} [str]
       * @param {object} [argsDescription]
       * @return {(string|Command)}
       */
      description(str, argsDescription) {
        if (str === void 0 && argsDescription === void 0)
          return this._description;
        this._description = str;
        if (argsDescription) {
          this._argsDescription = argsDescription;
        }
        return this;
      }
      /**
       * Set the summary. Used when listed as subcommand of parent.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      summary(str) {
        if (str === void 0) return this._summary;
        this._summary = str;
        return this;
      }
      /**
       * Set an alias for the command.
       *
       * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
       *
       * @param {string} [alias]
       * @return {(string|Command)}
       */
      alias(alias) {
        if (alias === void 0) return this._aliases[0];
        let command = this;
        if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
          command = this.commands[this.commands.length - 1];
        }
        if (alias === command._name)
          throw new Error("Command alias can't be the same as its name");
        const matchingCommand = this.parent?._findCommand(alias);
        if (matchingCommand) {
          const existingCmd = [matchingCommand.name()].concat(matchingCommand.aliases()).join("|");
          throw new Error(
            `cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`
          );
        }
        command._aliases.push(alias);
        return this;
      }
      /**
       * Set aliases for the command.
       *
       * Only the first alias is shown in the auto-generated help.
       *
       * @param {string[]} [aliases]
       * @return {(string[]|Command)}
       */
      aliases(aliases) {
        if (aliases === void 0) return this._aliases;
        aliases.forEach((alias) => this.alias(alias));
        return this;
      }
      /**
       * Set / get the command usage `str`.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      usage(str) {
        if (str === void 0) {
          if (this._usage) return this._usage;
          const args = this.registeredArguments.map((arg) => {
            return humanReadableArgName(arg);
          });
          return [].concat(
            this.options.length || this._helpOption !== null ? "[options]" : [],
            this.commands.length ? "[command]" : [],
            this.registeredArguments.length ? args : []
          ).join(" ");
        }
        this._usage = str;
        return this;
      }
      /**
       * Get or set the name of the command.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      name(str) {
        if (str === void 0) return this._name;
        this._name = str;
        return this;
      }
      /**
       * Set the name of the command from script filename, such as process.argv[1],
       * or require.main.filename, or __filename.
       *
       * (Used internally and public although not documented in README.)
       *
       * @example
       * program.nameFromFilename(require.main.filename);
       *
       * @param {string} filename
       * @return {Command}
       */
      nameFromFilename(filename) {
        this._name = path4.basename(filename, path4.extname(filename));
        return this;
      }
      /**
       * Get or set the directory for searching for executable subcommands of this command.
       *
       * @example
       * program.executableDir(__dirname);
       * // or
       * program.executableDir('subcommands');
       *
       * @param {string} [path]
       * @return {(string|null|Command)}
       */
      executableDir(path5) {
        if (path5 === void 0) return this._executableDir;
        this._executableDir = path5;
        return this;
      }
      /**
       * Return program help documentation.
       *
       * @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
       * @return {string}
       */
      helpInformation(contextOptions) {
        const helper = this.createHelp();
        const context = this._getOutputContext(contextOptions);
        helper.prepareContext({
          error: context.error,
          helpWidth: context.helpWidth,
          outputHasColors: context.hasColors
        });
        const text = helper.formatHelp(this, helper);
        if (context.hasColors) return text;
        return this._outputConfiguration.stripColor(text);
      }
      /**
       * @typedef HelpContext
       * @type {object}
       * @property {boolean} error
       * @property {number} helpWidth
       * @property {boolean} hasColors
       * @property {function} write - includes stripColor if needed
       *
       * @returns {HelpContext}
       * @private
       */
      _getOutputContext(contextOptions) {
        contextOptions = contextOptions || {};
        const error5 = !!contextOptions.error;
        let baseWrite;
        let hasColors;
        let helpWidth;
        if (error5) {
          baseWrite = (str) => this._outputConfiguration.writeErr(str);
          hasColors = this._outputConfiguration.getErrHasColors();
          helpWidth = this._outputConfiguration.getErrHelpWidth();
        } else {
          baseWrite = (str) => this._outputConfiguration.writeOut(str);
          hasColors = this._outputConfiguration.getOutHasColors();
          helpWidth = this._outputConfiguration.getOutHelpWidth();
        }
        const write = (str) => {
          if (!hasColors) str = this._outputConfiguration.stripColor(str);
          return baseWrite(str);
        };
        return { error: error5, write, hasColors, helpWidth };
      }
      /**
       * Output help information for this command.
       *
       * Outputs built-in help, and custom text added using `.addHelpText()`.
       *
       * @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
       */
      outputHelp(contextOptions) {
        let deprecatedCallback;
        if (typeof contextOptions === "function") {
          deprecatedCallback = contextOptions;
          contextOptions = void 0;
        }
        const outputContext = this._getOutputContext(contextOptions);
        const eventContext = {
          error: outputContext.error,
          write: outputContext.write,
          command: this
        };
        this._getCommandAndAncestors().reverse().forEach((command) => command.emit("beforeAllHelp", eventContext));
        this.emit("beforeHelp", eventContext);
        let helpInformation = this.helpInformation({ error: outputContext.error });
        if (deprecatedCallback) {
          helpInformation = deprecatedCallback(helpInformation);
          if (typeof helpInformation !== "string" && !Buffer.isBuffer(helpInformation)) {
            throw new Error("outputHelp callback must return a string or a Buffer");
          }
        }
        outputContext.write(helpInformation);
        if (this._getHelpOption()?.long) {
          this.emit(this._getHelpOption().long);
        }
        this.emit("afterHelp", eventContext);
        this._getCommandAndAncestors().forEach(
          (command) => command.emit("afterAllHelp", eventContext)
        );
      }
      /**
       * You can pass in flags and a description to customise the built-in help option.
       * Pass in false to disable the built-in help option.
       *
       * @example
       * program.helpOption('-?, --help' 'show help'); // customise
       * program.helpOption(false); // disable
       *
       * @param {(string | boolean)} flags
       * @param {string} [description]
       * @return {Command} `this` command for chaining
       */
      helpOption(flags, description) {
        if (typeof flags === "boolean") {
          if (flags) {
            this._helpOption = this._helpOption ?? void 0;
          } else {
            this._helpOption = null;
          }
          return this;
        }
        flags = flags ?? "-h, --help";
        description = description ?? "display help for command";
        this._helpOption = this.createOption(flags, description);
        return this;
      }
      /**
       * Lazy create help option.
       * Returns null if has been disabled with .helpOption(false).
       *
       * @returns {(Option | null)} the help option
       * @package
       */
      _getHelpOption() {
        if (this._helpOption === void 0) {
          this.helpOption(void 0, void 0);
        }
        return this._helpOption;
      }
      /**
       * Supply your own option to use for the built-in help option.
       * This is an alternative to using helpOption() to customise the flags and description etc.
       *
       * @param {Option} option
       * @return {Command} `this` command for chaining
       */
      addHelpOption(option) {
        this._helpOption = option;
        return this;
      }
      /**
       * Output help information and exit.
       *
       * Outputs built-in help, and custom text added using `.addHelpText()`.
       *
       * @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
       */
      help(contextOptions) {
        this.outputHelp(contextOptions);
        let exitCode = Number(process3.exitCode ?? 0);
        if (exitCode === 0 && contextOptions && typeof contextOptions !== "function" && contextOptions.error) {
          exitCode = 1;
        }
        this._exit(exitCode, "commander.help", "(outputHelp)");
      }
      /**
       * // Do a little typing to coordinate emit and listener for the help text events.
       * @typedef HelpTextEventContext
       * @type {object}
       * @property {boolean} error
       * @property {Command} command
       * @property {function} write
       */
      /**
       * Add additional text to be displayed with the built-in help.
       *
       * Position is 'before' or 'after' to affect just this command,
       * and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
       *
       * @param {string} position - before or after built-in help
       * @param {(string | Function)} text - string to add, or a function returning a string
       * @return {Command} `this` command for chaining
       */
      addHelpText(position, text) {
        const allowedValues = ["beforeAll", "before", "after", "afterAll"];
        if (!allowedValues.includes(position)) {
          throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        const helpEvent = `${position}Help`;
        this.on(helpEvent, (context) => {
          let helpStr;
          if (typeof text === "function") {
            helpStr = text({ error: context.error, command: context.command });
          } else {
            helpStr = text;
          }
          if (helpStr) {
            context.write(`${helpStr}
`);
          }
        });
        return this;
      }
      /**
       * Output help information if help flags specified
       *
       * @param {Array} args - array of options to search for help flags
       * @private
       */
      _outputHelpIfRequested(args) {
        const helpOption = this._getHelpOption();
        const helpRequested = helpOption && args.find((arg) => helpOption.is(arg));
        if (helpRequested) {
          this.outputHelp();
          this._exit(0, "commander.helpDisplayed", "(outputHelp)");
        }
      }
    };
    function incrementNodeInspectorPort(args) {
      return args.map((arg) => {
        if (!arg.startsWith("--inspect")) {
          return arg;
        }
        let debugOption;
        let debugHost = "127.0.0.1";
        let debugPort = "9229";
        let match;
        if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
          debugOption = match[1];
        } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
          debugOption = match[1];
          if (/^\d+$/.test(match[3])) {
            debugPort = match[3];
          } else {
            debugHost = match[3];
          }
        } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
          debugOption = match[1];
          debugHost = match[3];
          debugPort = match[4];
        }
        if (debugOption && debugPort !== "0") {
          return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
        }
        return arg;
      });
    }
    function useColor() {
      if (process3.env.NO_COLOR || process3.env.FORCE_COLOR === "0" || process3.env.FORCE_COLOR === "false")
        return false;
      if (process3.env.FORCE_COLOR || process3.env.CLICOLOR_FORCE !== void 0)
        return true;
      return void 0;
    }
    exports2.Command = Command2;
    exports2.useColor = useColor;
  }
});

// node_modules/commander/index.js
var require_commander = __commonJS({
  "node_modules/commander/index.js"(exports2) {
    var { Argument: Argument2 } = require_argument();
    var { Command: Command2 } = require_command();
    var { CommanderError: CommanderError2, InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var { Help: Help2 } = require_help();
    var { Option: Option2 } = require_option();
    exports2.program = new Command2();
    exports2.createCommand = (name) => new Command2(name);
    exports2.createOption = (flags, description) => new Option2(flags, description);
    exports2.createArgument = (name, description) => new Argument2(name, description);
    exports2.Command = Command2;
    exports2.Option = Option2;
    exports2.Argument = Argument2;
    exports2.Help = Help2;
    exports2.CommanderError = CommanderError2;
    exports2.InvalidArgumentError = InvalidArgumentError2;
    exports2.InvalidOptionArgumentError = InvalidArgumentError2;
  }
});

// node_modules/@xmldom/xmldom/lib/conventions.js
var require_conventions = __commonJS({
  "node_modules/@xmldom/xmldom/lib/conventions.js"(exports2) {
    "use strict";
    function find(list, predicate, ac) {
      if (ac === void 0) {
        ac = Array.prototype;
      }
      if (list && typeof ac.find === "function") {
        return ac.find.call(list, predicate);
      }
      for (var i = 0; i < list.length; i++) {
        if (hasOwn(list, i)) {
          var item = list[i];
          if (predicate.call(void 0, item, i, list)) {
            return item;
          }
        }
      }
    }
    function freeze(object, oc) {
      if (oc === void 0) {
        oc = Object;
      }
      if (oc && typeof oc.getOwnPropertyDescriptors === "function") {
        object = oc.create(null, oc.getOwnPropertyDescriptors(object));
      }
      return oc && typeof oc.freeze === "function" ? oc.freeze(object) : object;
    }
    function hasOwn(object, key) {
      return Object.prototype.hasOwnProperty.call(object, key);
    }
    function assign(target, source) {
      if (target === null || typeof target !== "object") {
        throw new TypeError("target is not an object");
      }
      for (var key in source) {
        if (hasOwn(source, key)) {
          target[key] = source[key];
        }
      }
      return target;
    }
    var HTML_BOOLEAN_ATTRIBUTES = freeze({
      allowfullscreen: true,
      async: true,
      autofocus: true,
      autoplay: true,
      checked: true,
      controls: true,
      default: true,
      defer: true,
      disabled: true,
      formnovalidate: true,
      hidden: true,
      ismap: true,
      itemscope: true,
      loop: true,
      multiple: true,
      muted: true,
      nomodule: true,
      novalidate: true,
      open: true,
      playsinline: true,
      readonly: true,
      required: true,
      reversed: true,
      selected: true
    });
    function isHTMLBooleanAttribute(name) {
      return hasOwn(HTML_BOOLEAN_ATTRIBUTES, name.toLowerCase());
    }
    var HTML_VOID_ELEMENTS = freeze({
      area: true,
      base: true,
      br: true,
      col: true,
      embed: true,
      hr: true,
      img: true,
      input: true,
      link: true,
      meta: true,
      param: true,
      source: true,
      track: true,
      wbr: true
    });
    function isHTMLVoidElement(tagName) {
      return hasOwn(HTML_VOID_ELEMENTS, tagName.toLowerCase());
    }
    var HTML_RAW_TEXT_ELEMENTS = freeze({
      script: false,
      style: false,
      textarea: true,
      title: true
    });
    function isHTMLRawTextElement(tagName) {
      var key = tagName.toLowerCase();
      return hasOwn(HTML_RAW_TEXT_ELEMENTS, key) && !HTML_RAW_TEXT_ELEMENTS[key];
    }
    function isHTMLEscapableRawTextElement(tagName) {
      var key = tagName.toLowerCase();
      return hasOwn(HTML_RAW_TEXT_ELEMENTS, key) && HTML_RAW_TEXT_ELEMENTS[key];
    }
    function isHTMLMimeType(mimeType) {
      return mimeType === MIME_TYPE.HTML;
    }
    function hasDefaultHTMLNamespace(mimeType) {
      return isHTMLMimeType(mimeType) || mimeType === MIME_TYPE.XML_XHTML_APPLICATION;
    }
    var MIME_TYPE = freeze({
      /**
       * `text/html`, the only mime type that triggers treating an XML document as HTML.
       *
       * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
       * @see https://en.wikipedia.org/wiki/HTML Wikipedia
       * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
       * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring
       *      WHATWG HTML Spec
       */
      HTML: "text/html",
      /**
       * `application/xml`, the standard mime type for XML documents.
       *
       * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType
       *      registration
       * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
       * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
       */
      XML_APPLICATION: "application/xml",
      /**
       * `text/xml`, an alias for `application/xml`.
       *
       * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
       * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
       * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
       */
      XML_TEXT: "text/xml",
      /**
       * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
       * but is parsed as an XML document.
       *
       * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType
       *      registration
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
       * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
       */
      XML_XHTML_APPLICATION: "application/xhtml+xml",
      /**
       * `image/svg+xml`,
       *
       * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
       * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
       * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
       */
      XML_SVG_IMAGE: "image/svg+xml"
    });
    var _MIME_TYPES = Object.keys(MIME_TYPE).map(function(key) {
      return MIME_TYPE[key];
    });
    function isValidMimeType(mimeType) {
      return _MIME_TYPES.indexOf(mimeType) > -1;
    }
    var NAMESPACE = freeze({
      /**
       * The XHTML namespace.
       *
       * @see http://www.w3.org/1999/xhtml
       */
      HTML: "http://www.w3.org/1999/xhtml",
      /**
       * The SVG namespace.
       *
       * @see http://www.w3.org/2000/svg
       */
      SVG: "http://www.w3.org/2000/svg",
      /**
       * The `xml:` namespace.
       *
       * @see http://www.w3.org/XML/1998/namespace
       */
      XML: "http://www.w3.org/XML/1998/namespace",
      /**
       * The `xmlns:` namespace.
       *
       * @see https://www.w3.org/2000/xmlns/
       */
      XMLNS: "http://www.w3.org/2000/xmlns/"
    });
    exports2.assign = assign;
    exports2.find = find;
    exports2.freeze = freeze;
    exports2.HTML_BOOLEAN_ATTRIBUTES = HTML_BOOLEAN_ATTRIBUTES;
    exports2.HTML_RAW_TEXT_ELEMENTS = HTML_RAW_TEXT_ELEMENTS;
    exports2.HTML_VOID_ELEMENTS = HTML_VOID_ELEMENTS;
    exports2.hasDefaultHTMLNamespace = hasDefaultHTMLNamespace;
    exports2.hasOwn = hasOwn;
    exports2.isHTMLBooleanAttribute = isHTMLBooleanAttribute;
    exports2.isHTMLRawTextElement = isHTMLRawTextElement;
    exports2.isHTMLEscapableRawTextElement = isHTMLEscapableRawTextElement;
    exports2.isHTMLMimeType = isHTMLMimeType;
    exports2.isHTMLVoidElement = isHTMLVoidElement;
    exports2.isValidMimeType = isValidMimeType;
    exports2.MIME_TYPE = MIME_TYPE;
    exports2.NAMESPACE = NAMESPACE;
  }
});

// node_modules/@xmldom/xmldom/lib/errors.js
var require_errors = __commonJS({
  "node_modules/@xmldom/xmldom/lib/errors.js"(exports2) {
    "use strict";
    var conventions = require_conventions();
    function extendError(constructor, writableName) {
      constructor.prototype = Object.create(Error.prototype, {
        constructor: { value: constructor },
        name: { value: constructor.name, enumerable: true, writable: writableName }
      });
    }
    var DOMExceptionName = conventions.freeze({
      /**
       * the default value as defined by the spec
       */
      Error: "Error",
      /**
       * @deprecated
       * Use RangeError instead.
       */
      IndexSizeError: "IndexSizeError",
      /**
       * @deprecated
       * Just to match the related static code, not part of the spec.
       */
      DomstringSizeError: "DomstringSizeError",
      HierarchyRequestError: "HierarchyRequestError",
      WrongDocumentError: "WrongDocumentError",
      InvalidCharacterError: "InvalidCharacterError",
      /**
       * @deprecated
       * Just to match the related static code, not part of the spec.
       */
      NoDataAllowedError: "NoDataAllowedError",
      NoModificationAllowedError: "NoModificationAllowedError",
      NotFoundError: "NotFoundError",
      NotSupportedError: "NotSupportedError",
      InUseAttributeError: "InUseAttributeError",
      InvalidStateError: "InvalidStateError",
      SyntaxError: "SyntaxError",
      InvalidModificationError: "InvalidModificationError",
      NamespaceError: "NamespaceError",
      /**
       * @deprecated
       * Use TypeError for invalid arguments,
       * "NotSupportedError" DOMException for unsupported operations,
       * and "NotAllowedError" DOMException for denied requests instead.
       */
      InvalidAccessError: "InvalidAccessError",
      /**
       * @deprecated
       * Just to match the related static code, not part of the spec.
       */
      ValidationError: "ValidationError",
      /**
       * @deprecated
       * Use TypeError instead.
       */
      TypeMismatchError: "TypeMismatchError",
      SecurityError: "SecurityError",
      NetworkError: "NetworkError",
      AbortError: "AbortError",
      /**
       * @deprecated
       * Just to match the related static code, not part of the spec.
       */
      URLMismatchError: "URLMismatchError",
      QuotaExceededError: "QuotaExceededError",
      TimeoutError: "TimeoutError",
      InvalidNodeTypeError: "InvalidNodeTypeError",
      DataCloneError: "DataCloneError",
      EncodingError: "EncodingError",
      NotReadableError: "NotReadableError",
      UnknownError: "UnknownError",
      ConstraintError: "ConstraintError",
      DataError: "DataError",
      TransactionInactiveError: "TransactionInactiveError",
      ReadOnlyError: "ReadOnlyError",
      VersionError: "VersionError",
      OperationError: "OperationError",
      NotAllowedError: "NotAllowedError",
      OptOutError: "OptOutError"
    });
    var DOMExceptionNames = Object.keys(DOMExceptionName);
    function isValidDomExceptionCode(value) {
      return typeof value === "number" && value >= 1 && value <= 25;
    }
    function endsWithError(value) {
      return typeof value === "string" && value.substring(value.length - DOMExceptionName.Error.length) === DOMExceptionName.Error;
    }
    function DOMException(messageOrCode, nameOrMessage) {
      if (isValidDomExceptionCode(messageOrCode)) {
        this.name = DOMExceptionNames[messageOrCode];
        this.message = nameOrMessage || "";
      } else {
        this.message = messageOrCode;
        this.name = endsWithError(nameOrMessage) ? nameOrMessage : DOMExceptionName.Error;
      }
      if (Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
    }
    extendError(DOMException, true);
    Object.defineProperties(DOMException.prototype, {
      code: {
        enumerable: true,
        get: function() {
          var code = DOMExceptionNames.indexOf(this.name);
          if (isValidDomExceptionCode(code)) return code;
          return 0;
        }
      }
    });
    var ExceptionCode = {
      INDEX_SIZE_ERR: 1,
      DOMSTRING_SIZE_ERR: 2,
      HIERARCHY_REQUEST_ERR: 3,
      WRONG_DOCUMENT_ERR: 4,
      INVALID_CHARACTER_ERR: 5,
      NO_DATA_ALLOWED_ERR: 6,
      NO_MODIFICATION_ALLOWED_ERR: 7,
      NOT_FOUND_ERR: 8,
      NOT_SUPPORTED_ERR: 9,
      INUSE_ATTRIBUTE_ERR: 10,
      INVALID_STATE_ERR: 11,
      SYNTAX_ERR: 12,
      INVALID_MODIFICATION_ERR: 13,
      NAMESPACE_ERR: 14,
      INVALID_ACCESS_ERR: 15,
      VALIDATION_ERR: 16,
      TYPE_MISMATCH_ERR: 17,
      SECURITY_ERR: 18,
      NETWORK_ERR: 19,
      ABORT_ERR: 20,
      URL_MISMATCH_ERR: 21,
      QUOTA_EXCEEDED_ERR: 22,
      TIMEOUT_ERR: 23,
      INVALID_NODE_TYPE_ERR: 24,
      DATA_CLONE_ERR: 25
    };
    var entries = Object.entries(ExceptionCode);
    for (i = 0; i < entries.length; i++) {
      key = entries[i][0];
      DOMException[key] = entries[i][1];
    }
    var key;
    var i;
    function ParseError(message, locator) {
      this.message = message;
      this.locator = locator;
      if (Error.captureStackTrace) Error.captureStackTrace(this, ParseError);
    }
    extendError(ParseError);
    exports2.DOMException = DOMException;
    exports2.DOMExceptionName = DOMExceptionName;
    exports2.ExceptionCode = ExceptionCode;
    exports2.ParseError = ParseError;
  }
});

// node_modules/@xmldom/xmldom/lib/grammar.js
var require_grammar = __commonJS({
  "node_modules/@xmldom/xmldom/lib/grammar.js"(exports2) {
    "use strict";
    function detectUnicodeSupport(RegExpImpl) {
      try {
        if (typeof RegExpImpl !== "function") {
          RegExpImpl = RegExp;
        }
        var match = new RegExpImpl("\u{1D306}", "u").exec("\u{1D306}");
        return !!match && match[0].length === 2;
      } catch (error5) {
      }
      return false;
    }
    var UNICODE_SUPPORT = detectUnicodeSupport();
    function chars(regexp) {
      if (regexp.source[0] !== "[") {
        throw new Error(regexp + " can not be used with chars");
      }
      return regexp.source.slice(1, regexp.source.lastIndexOf("]"));
    }
    function chars_without(regexp, search) {
      if (regexp.source[0] !== "[") {
        throw new Error("/" + regexp.source + "/ can not be used with chars_without");
      }
      if (!search || typeof search !== "string") {
        throw new Error(JSON.stringify(search) + " is not a valid search");
      }
      if (regexp.source.indexOf(search) === -1) {
        throw new Error('"' + search + '" is not is /' + regexp.source + "/");
      }
      if (search === "-" && regexp.source.indexOf(search) !== 1) {
        throw new Error('"' + search + '" is not at the first postion of /' + regexp.source + "/");
      }
      return new RegExp(regexp.source.replace(search, ""), UNICODE_SUPPORT ? "u" : "");
    }
    function reg(args) {
      var self2 = this;
      return new RegExp(
        Array.prototype.slice.call(arguments).map(function(part) {
          var isStr = typeof part === "string";
          if (isStr && self2 === void 0 && part === "|") {
            throw new Error("use regg instead of reg to wrap expressions with `|`!");
          }
          return isStr ? part : part.source;
        }).join(""),
        UNICODE_SUPPORT ? "mu" : "m"
      );
    }
    function regg(args) {
      if (arguments.length === 0) {
        throw new Error("no parameters provided");
      }
      return reg.apply(regg, ["(?:"].concat(Array.prototype.slice.call(arguments), [")"]));
    }
    var UNICODE_REPLACEMENT_CHARACTER = "\uFFFD";
    var Char = /[-\x09\x0A\x0D\x20-\x2C\x2E-\uD7FF\uE000-\uFFFD]/;
    if (UNICODE_SUPPORT) {
      Char = reg("[", chars(Char), "\\u{10000}-\\u{10FFFF}", "]");
    }
    var _SChar = /[\x20\x09\x0D\x0A]/;
    var SChar_s = chars(_SChar);
    var S = reg(_SChar, "+");
    var S_OPT = reg(_SChar, "*");
    var NameStartChar = /[:_a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
    if (UNICODE_SUPPORT) {
      NameStartChar = reg("[", chars(NameStartChar), "\\u{10000}-\\u{10FFFF}", "]");
    }
    var NameStartChar_s = chars(NameStartChar);
    var NameChar = reg("[", NameStartChar_s, chars(/[-.0-9\xB7]/), chars(/[\u0300-\u036F\u203F-\u2040]/), "]");
    var Name = reg(NameStartChar, NameChar, "*");
    var Nmtoken = reg(NameChar, "+");
    var EntityRef = reg("&", Name, ";");
    var CharRef = regg(/&#[0-9]+;|&#x[0-9a-fA-F]+;/);
    var Reference = regg(EntityRef, "|", CharRef);
    var PEReference = reg("%", Name, ";");
    var EntityValue = regg(
      reg('"', regg(/[^%&"]/, "|", PEReference, "|", Reference), "*", '"'),
      "|",
      reg("'", regg(/[^%&']/, "|", PEReference, "|", Reference), "*", "'")
    );
    var AttValue = regg('"', regg(/[^<&"]/, "|", Reference), "*", '"', "|", "'", regg(/[^<&']/, "|", Reference), "*", "'");
    var NCNameStartChar = chars_without(NameStartChar, ":");
    var NCNameChar = chars_without(NameChar, ":");
    var NCName = reg(NCNameStartChar, NCNameChar, "*");
    var QName = reg(NCName, regg(":", NCName), "?");
    var QName_exact = reg("^", QName, "$");
    var QName_group = reg("(", QName, ")");
    var SystemLiteral = regg(/"[^"]*"|'[^']*'/);
    var PI = reg(/^<\?/, "(", Name, ")", regg(S, "(", Char, "*?)"), "?", /\?>/);
    var PubidChar = /[\x20\x0D\x0Aa-zA-Z0-9-'()+,./:=?;!*#@$_%]/;
    var PubidLiteral = regg('"', PubidChar, '*"', "|", "'", chars_without(PubidChar, "'"), "*'");
    var COMMENT_START = "<!--";
    var COMMENT_END = "-->";
    var Comment = reg(COMMENT_START, regg(chars_without(Char, "-"), "|", reg("-", chars_without(Char, "-"))), "*", COMMENT_END);
    var PCDATA = "#PCDATA";
    var Mixed = regg(
      reg(/\(/, S_OPT, PCDATA, regg(S_OPT, /\|/, S_OPT, QName), "*", S_OPT, /\)\*/),
      "|",
      reg(/\(/, S_OPT, PCDATA, S_OPT, /\)/)
    );
    var _children_quantity = /[?*+]?/;
    var children = reg(
      /\([^>]+\)/,
      _children_quantity
      /*regg(choice, '|', seq), _children_quantity*/
    );
    var contentspec = regg("EMPTY", "|", "ANY", "|", Mixed, "|", children);
    var ELEMENTDECL_START = "<!ELEMENT";
    var elementdecl = reg(ELEMENTDECL_START, S, regg(QName, "|", PEReference), S, regg(contentspec, "|", PEReference), S_OPT, ">");
    var NotationType = reg("NOTATION", S, /\(/, S_OPT, Name, regg(S_OPT, /\|/, S_OPT, Name), "*", S_OPT, /\)/);
    var Enumeration = reg(/\(/, S_OPT, Nmtoken, regg(S_OPT, /\|/, S_OPT, Nmtoken), "*", S_OPT, /\)/);
    var EnumeratedType = regg(NotationType, "|", Enumeration);
    var AttType = regg(/CDATA|ID|IDREF|IDREFS|ENTITY|ENTITIES|NMTOKEN|NMTOKENS/, "|", EnumeratedType);
    var DefaultDecl = regg(/#REQUIRED|#IMPLIED/, "|", regg(regg("#FIXED", S), "?", AttValue));
    var AttDef = regg(S, Name, S, AttType, S, DefaultDecl);
    var ATTLIST_DECL_START = "<!ATTLIST";
    var AttlistDecl = reg(ATTLIST_DECL_START, S, Name, AttDef, "*", S_OPT, ">");
    var ABOUT_LEGACY_COMPAT = "about:legacy-compat";
    var ABOUT_LEGACY_COMPAT_SystemLiteral = regg('"' + ABOUT_LEGACY_COMPAT + '"', "|", "'" + ABOUT_LEGACY_COMPAT + "'");
    var SYSTEM = "SYSTEM";
    var PUBLIC = "PUBLIC";
    var ExternalID = regg(regg(SYSTEM, S, SystemLiteral), "|", regg(PUBLIC, S, PubidLiteral, S, SystemLiteral));
    var ExternalID_match = reg(
      "^",
      regg(
        regg(SYSTEM, S, "(?<SystemLiteralOnly>", SystemLiteral, ")"),
        "|",
        regg(PUBLIC, S, "(?<PubidLiteral>", PubidLiteral, ")", S, "(?<SystemLiteral>", SystemLiteral, ")")
      )
    );
    var NDataDecl = regg(S, "NDATA", S, Name);
    var EntityDef = regg(EntityValue, "|", regg(ExternalID, NDataDecl, "?"));
    var ENTITY_DECL_START = "<!ENTITY";
    var GEDecl = reg(ENTITY_DECL_START, S, Name, S, EntityDef, S_OPT, ">");
    var PEDef = regg(EntityValue, "|", ExternalID);
    var PEDecl = reg(ENTITY_DECL_START, S, "%", S, Name, S, PEDef, S_OPT, ">");
    var EntityDecl = regg(GEDecl, "|", PEDecl);
    var PublicID = reg(PUBLIC, S, PubidLiteral);
    var NotationDecl = reg("<!NOTATION", S, Name, S, regg(ExternalID, "|", PublicID), S_OPT, ">");
    var Eq = reg(S_OPT, "=", S_OPT);
    var VersionNum = /1[.]\d+/;
    var VersionInfo = reg(S, "version", Eq, regg("'", VersionNum, "'", "|", '"', VersionNum, '"'));
    var EncName = /[A-Za-z][-A-Za-z0-9._]*/;
    var EncodingDecl = regg(S, "encoding", Eq, regg('"', EncName, '"', "|", "'", EncName, "'"));
    var SDDecl = regg(S, "standalone", Eq, regg("'", regg("yes", "|", "no"), "'", "|", '"', regg("yes", "|", "no"), '"'));
    var XMLDecl = reg(/^<\?xml/, VersionInfo, EncodingDecl, "?", SDDecl, "?", S_OPT, /\?>/);
    var DOCTYPE_DECL_START = "<!DOCTYPE";
    var CDATA_START = "<![CDATA[";
    var CDATA_END = "]]>";
    var CDStart = /<!\[CDATA\[/;
    var CDEnd = /\]\]>/;
    var CData = reg(Char, "*?", CDEnd);
    var CDSect = reg(CDStart, CData);
    exports2.chars = chars;
    exports2.chars_without = chars_without;
    exports2.detectUnicodeSupport = detectUnicodeSupport;
    exports2.reg = reg;
    exports2.regg = regg;
    exports2.ABOUT_LEGACY_COMPAT = ABOUT_LEGACY_COMPAT;
    exports2.ABOUT_LEGACY_COMPAT_SystemLiteral = ABOUT_LEGACY_COMPAT_SystemLiteral;
    exports2.AttlistDecl = AttlistDecl;
    exports2.CDATA_START = CDATA_START;
    exports2.CDATA_END = CDATA_END;
    exports2.CDSect = CDSect;
    exports2.Char = Char;
    exports2.Comment = Comment;
    exports2.COMMENT_START = COMMENT_START;
    exports2.COMMENT_END = COMMENT_END;
    exports2.DOCTYPE_DECL_START = DOCTYPE_DECL_START;
    exports2.elementdecl = elementdecl;
    exports2.EntityDecl = EntityDecl;
    exports2.EntityValue = EntityValue;
    exports2.ExternalID = ExternalID;
    exports2.ExternalID_match = ExternalID_match;
    exports2.Name = Name;
    exports2.NotationDecl = NotationDecl;
    exports2.Reference = Reference;
    exports2.PEReference = PEReference;
    exports2.PI = PI;
    exports2.PUBLIC = PUBLIC;
    exports2.PubidLiteral = PubidLiteral;
    exports2.QName = QName;
    exports2.QName_exact = QName_exact;
    exports2.QName_group = QName_group;
    exports2.S = S;
    exports2.SChar_s = SChar_s;
    exports2.S_OPT = S_OPT;
    exports2.SYSTEM = SYSTEM;
    exports2.SystemLiteral = SystemLiteral;
    exports2.UNICODE_REPLACEMENT_CHARACTER = UNICODE_REPLACEMENT_CHARACTER;
    exports2.UNICODE_SUPPORT = UNICODE_SUPPORT;
    exports2.XMLDecl = XMLDecl;
  }
});

// node_modules/@xmldom/xmldom/lib/dom.js
var require_dom = __commonJS({
  "node_modules/@xmldom/xmldom/lib/dom.js"(exports2) {
    "use strict";
    var conventions = require_conventions();
    var find = conventions.find;
    var hasDefaultHTMLNamespace = conventions.hasDefaultHTMLNamespace;
    var hasOwn = conventions.hasOwn;
    var isHTMLMimeType = conventions.isHTMLMimeType;
    var isHTMLRawTextElement = conventions.isHTMLRawTextElement;
    var isHTMLVoidElement = conventions.isHTMLVoidElement;
    var MIME_TYPE = conventions.MIME_TYPE;
    var NAMESPACE = conventions.NAMESPACE;
    var PDC = Symbol();
    var errors = require_errors();
    var DOMException = errors.DOMException;
    var DOMExceptionName = errors.DOMExceptionName;
    var g = require_grammar();
    function checkSymbol(symbol) {
      if (symbol !== PDC) {
        throw new TypeError("Illegal constructor");
      }
    }
    function notEmptyString(input) {
      return input !== "";
    }
    function splitOnASCIIWhitespace(input) {
      return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : [];
    }
    function orderedSetReducer(current, element) {
      if (!hasOwn(current, element)) {
        current[element] = true;
      }
      return current;
    }
    function toOrderedSet(input) {
      if (!input) return [];
      var list = splitOnASCIIWhitespace(input);
      return Object.keys(list.reduce(orderedSetReducer, {}));
    }
    function arrayIncludes(list) {
      return function(element) {
        return list && list.indexOf(element) !== -1;
      };
    }
    function validateQualifiedName(qualifiedName) {
      if (!g.QName_exact.test(qualifiedName)) {
        throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'invalid character in qualified name "' + qualifiedName + '"');
      }
    }
    function validateAndExtract(namespace, qualifiedName) {
      validateQualifiedName(qualifiedName);
      namespace = namespace || null;
      var prefix = null;
      var localName = qualifiedName;
      if (qualifiedName.indexOf(":") >= 0) {
        var splitResult = qualifiedName.split(":");
        prefix = splitResult[0];
        localName = splitResult[1];
      }
      if (prefix !== null && namespace === null) {
        throw new DOMException(DOMException.NAMESPACE_ERR, "prefix is non-null and namespace is null");
      }
      if (prefix === "xml" && namespace !== conventions.NAMESPACE.XML) {
        throw new DOMException(DOMException.NAMESPACE_ERR, 'prefix is "xml" and namespace is not the XML namespace');
      }
      if ((prefix === "xmlns" || qualifiedName === "xmlns") && namespace !== conventions.NAMESPACE.XMLNS) {
        throw new DOMException(
          DOMException.NAMESPACE_ERR,
          'either qualifiedName or prefix is "xmlns" and namespace is not the XMLNS namespace'
        );
      }
      if (namespace === conventions.NAMESPACE.XMLNS && prefix !== "xmlns" && qualifiedName !== "xmlns") {
        throw new DOMException(
          DOMException.NAMESPACE_ERR,
          'namespace is the XMLNS namespace and neither qualifiedName nor prefix is "xmlns"'
        );
      }
      return [namespace, prefix, localName];
    }
    function copy(src, dest) {
      for (var p in src) {
        if (hasOwn(src, p)) {
          dest[p] = src[p];
        }
      }
    }
    function _extends(Class, Super) {
      var pt = Class.prototype;
      if (!(pt instanceof Super)) {
        let t = function() {
        };
        t.prototype = Super.prototype;
        t = new t();
        copy(pt, t);
        Class.prototype = pt = t;
      }
      if (pt.constructor != Class) {
        if (typeof Class != "function") {
          console.error("unknown Class:" + Class);
        }
        pt.constructor = Class;
      }
    }
    var NodeType = {};
    var ELEMENT_NODE = NodeType.ELEMENT_NODE = 1;
    var ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE = 2;
    var TEXT_NODE = NodeType.TEXT_NODE = 3;
    var CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE = 4;
    var ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE = 5;
    var ENTITY_NODE = NodeType.ENTITY_NODE = 6;
    var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
    var COMMENT_NODE = NodeType.COMMENT_NODE = 8;
    var DOCUMENT_NODE = NodeType.DOCUMENT_NODE = 9;
    var DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE = 10;
    var DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE = 11;
    var NOTATION_NODE = NodeType.NOTATION_NODE = 12;
    var DocumentPosition = conventions.freeze({
      DOCUMENT_POSITION_DISCONNECTED: 1,
      DOCUMENT_POSITION_PRECEDING: 2,
      DOCUMENT_POSITION_FOLLOWING: 4,
      DOCUMENT_POSITION_CONTAINS: 8,
      DOCUMENT_POSITION_CONTAINED_BY: 16,
      DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32
    });
    function commonAncestor(a, b) {
      if (b.length < a.length) return commonAncestor(b, a);
      var c = null;
      for (var n in a) {
        if (a[n] !== b[n]) return c;
        c = a[n];
      }
      return c;
    }
    function docGUID(doc) {
      if (!doc.guid) doc.guid = Math.random();
      return doc.guid;
    }
    function NodeList() {
    }
    NodeList.prototype = {
      /**
       * The number of nodes in the list. The range of valid child node indices is 0 to length-1
       * inclusive.
       *
       * @type {number}
       */
      length: 0,
      /**
       * Returns the item at `index`. If index is greater than or equal to the number of nodes in
       * the list, this returns null.
       *
       * @param index
       * Unsigned long Index into the collection.
       * @returns {Node | null}
       * The node at position `index` in the NodeList,
       * or null if that is not a valid index.
       */
      item: function(index) {
        return index >= 0 && index < this.length ? this[index] : null;
      },
      /**
       * Returns a string representation of the NodeList.
       *
       * @param {unknown} nodeFilter
       * __A filter function? Not implemented according to the spec?__.
       * @returns {string}
       * A string representation of the NodeList.
       */
      toString: function(nodeFilter) {
        for (var buf = [], i = 0; i < this.length; i++) {
          serializeToString(this[i], buf, nodeFilter);
        }
        return buf.join("");
      },
      /**
       * Filters the NodeList based on a predicate.
       *
       * @param {function(Node): boolean} predicate
       * - A predicate function to filter the NodeList.
       * @returns {Node[]}
       * An array of nodes that satisfy the predicate.
       * @private
       */
      filter: function(predicate) {
        return Array.prototype.filter.call(this, predicate);
      },
      /**
       * Returns the first index at which a given node can be found in the NodeList, or -1 if it is
       * not present.
       *
       * @param {Node} item
       * - The Node item to locate in the NodeList.
       * @returns {number}
       * The first index of the node in the NodeList; -1 if not found.
       * @private
       */
      indexOf: function(item) {
        return Array.prototype.indexOf.call(this, item);
      }
    };
    NodeList.prototype[Symbol.iterator] = function() {
      var me = this;
      var index = 0;
      return {
        next: function() {
          if (index < me.length) {
            return {
              value: me[index++],
              done: false
            };
          } else {
            return {
              done: true
            };
          }
        },
        return: function() {
          return {
            done: true
          };
        }
      };
    };
    function LiveNodeList(node, refresh) {
      this._node = node;
      this._refresh = refresh;
      _updateLiveList(this);
    }
    function _updateLiveList(list) {
      var inc = list._node._inc || list._node.ownerDocument._inc;
      if (list._inc !== inc) {
        var ls = list._refresh(list._node);
        __set__(list, "length", ls.length);
        if (!list.$$length || ls.length < list.$$length) {
          for (var i = ls.length; i in list; i++) {
            if (hasOwn(list, i)) {
              delete list[i];
            }
          }
        }
        copy(ls, list);
        list._inc = inc;
      }
    }
    LiveNodeList.prototype.item = function(i) {
      _updateLiveList(this);
      return this[i] || null;
    };
    _extends(LiveNodeList, NodeList);
    function NamedNodeMap() {
    }
    function _findNodeIndex(list, node) {
      var i = 0;
      while (i < list.length) {
        if (list[i] === node) {
          return i;
        }
        i++;
      }
    }
    function _addNamedNode(el, list, newAttr, oldAttr) {
      if (oldAttr) {
        list[_findNodeIndex(list, oldAttr)] = newAttr;
      } else {
        list[list.length] = newAttr;
        list.length++;
      }
      if (el) {
        newAttr.ownerElement = el;
        var doc = el.ownerDocument;
        if (doc) {
          oldAttr && _onRemoveAttribute(doc, el, oldAttr);
          _onAddAttribute(doc, el, newAttr);
        }
      }
    }
    function _removeNamedNode(el, list, attr) {
      var i = _findNodeIndex(list, attr);
      if (i >= 0) {
        var lastIndex = list.length - 1;
        while (i <= lastIndex) {
          list[i] = list[++i];
        }
        list.length = lastIndex;
        if (el) {
          var doc = el.ownerDocument;
          if (doc) {
            _onRemoveAttribute(doc, el, attr);
          }
          attr.ownerElement = null;
        }
      }
    }
    NamedNodeMap.prototype = {
      length: 0,
      item: NodeList.prototype.item,
      /**
       * Get an attribute by name. Note: Name is in lower case in case of HTML namespace and
       * document.
       *
       * @param {string} localName
       * The local name of the attribute.
       * @returns {Attr | null}
       * The attribute with the given local name, or null if no such attribute exists.
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-name
       */
      getNamedItem: function(localName) {
        if (this._ownerElement && this._ownerElement._isInHTMLDocumentAndNamespace()) {
          localName = localName.toLowerCase();
        }
        var i = 0;
        while (i < this.length) {
          var attr = this[i];
          if (attr.nodeName === localName) {
            return attr;
          }
          i++;
        }
        return null;
      },
      /**
       * Set an attribute.
       *
       * @param {Attr} attr
       * The attribute to set.
       * @returns {Attr | null}
       * The old attribute with the same local name and namespace URI as the new one, or null if no
       * such attribute exists.
       * @throws {DOMException}
       * With code:
       * - {@link INUSE_ATTRIBUTE_ERR} - If the attribute is already an attribute of another
       * element.
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-set
       */
      setNamedItem: function(attr) {
        var el = attr.ownerElement;
        if (el && el !== this._ownerElement) {
          throw new DOMException(DOMException.INUSE_ATTRIBUTE_ERR);
        }
        var oldAttr = this.getNamedItemNS(attr.namespaceURI, attr.localName);
        if (oldAttr === attr) {
          return attr;
        }
        _addNamedNode(this._ownerElement, this, attr, oldAttr);
        return oldAttr;
      },
      /**
       * Set an attribute, replacing an existing attribute with the same local name and namespace
       * URI if one exists.
       *
       * @param {Attr} attr
       * The attribute to set.
       * @returns {Attr | null}
       * The old attribute with the same local name and namespace URI as the new one, or null if no
       * such attribute exists.
       * @throws {DOMException}
       * Throws a DOMException with the name "InUseAttributeError" if the attribute is already an
       * attribute of another element.
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-set
       */
      setNamedItemNS: function(attr) {
        return this.setNamedItem(attr);
      },
      /**
       * Removes an attribute specified by the local name.
       *
       * @param {string} localName
       * The local name of the attribute to be removed.
       * @returns {Attr}
       * The attribute node that was removed.
       * @throws {DOMException}
       * With code:
       * - {@link DOMException.NOT_FOUND_ERR} if no attribute with the given name is found.
       * @see https://dom.spec.whatwg.org/#dom-namednodemap-removenameditem
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-name
       */
      removeNamedItem: function(localName) {
        var attr = this.getNamedItem(localName);
        if (!attr) {
          throw new DOMException(DOMException.NOT_FOUND_ERR, localName);
        }
        _removeNamedNode(this._ownerElement, this, attr);
        return attr;
      },
      /**
       * Removes an attribute specified by the namespace and local name.
       *
       * @param {string | null} namespaceURI
       * The namespace URI of the attribute to be removed.
       * @param {string} localName
       * The local name of the attribute to be removed.
       * @returns {Attr}
       * The attribute node that was removed.
       * @throws {DOMException}
       * With code:
       * - {@link DOMException.NOT_FOUND_ERR} if no attribute with the given namespace URI and local
       * name is found.
       * @see https://dom.spec.whatwg.org/#dom-namednodemap-removenameditemns
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-namespace
       */
      removeNamedItemNS: function(namespaceURI, localName) {
        var attr = this.getNamedItemNS(namespaceURI, localName);
        if (!attr) {
          throw new DOMException(DOMException.NOT_FOUND_ERR, namespaceURI ? namespaceURI + " : " + localName : localName);
        }
        _removeNamedNode(this._ownerElement, this, attr);
        return attr;
      },
      /**
       * Get an attribute by namespace and local name.
       *
       * @param {string | null} namespaceURI
       * The namespace URI of the attribute.
       * @param {string} localName
       * The local name of the attribute.
       * @returns {Attr | null}
       * The attribute with the given namespace URI and local name, or null if no such attribute
       * exists.
       * @see https://dom.spec.whatwg.org/#concept-element-attributes-get-by-namespace
       */
      getNamedItemNS: function(namespaceURI, localName) {
        if (!namespaceURI) {
          namespaceURI = null;
        }
        var i = 0;
        while (i < this.length) {
          var node = this[i];
          if (node.localName === localName && node.namespaceURI === namespaceURI) {
            return node;
          }
          i++;
        }
        return null;
      }
    };
    NamedNodeMap.prototype[Symbol.iterator] = function() {
      var me = this;
      var index = 0;
      return {
        next: function() {
          if (index < me.length) {
            return {
              value: me[index++],
              done: false
            };
          } else {
            return {
              done: true
            };
          }
        },
        return: function() {
          return {
            done: true
          };
        }
      };
    };
    function DOMImplementation() {
    }
    DOMImplementation.prototype = {
      /**
       * Test if the DOM implementation implements a specific feature and version, as specified in
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/core.html#DOMFeatures DOM Features}.
       *
       * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given
       * feature is supported. The different implementations fairly diverged in what kind of
       * features were reported. The latest version of the spec settled to force this method to
       * always return true, where the functionality was accurate and in use.
       *
       * @deprecated
       * It is deprecated and modern browsers return true in all cases.
       * @function DOMImplementation#hasFeature
       * @param {string} feature
       * The name of the feature to test.
       * @param {string} [version]
       * This is the version number of the feature to test.
       * @returns {boolean}
       * Always returns true.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
       * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-5CED94D7 DOM Level 3 Core
       */
      hasFeature: function(feature, version2) {
        return true;
      },
      /**
       * Creates a DOM Document object of the specified type with its document element. Note that
       * based on the {@link DocumentType}
       * given to create the document, the implementation may instantiate specialized
       * {@link Document} objects that support additional features than the "Core", such as "HTML"
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#DOM2HTML DOM Level 2 HTML}.
       * On the other hand, setting the {@link DocumentType} after the document was created makes
       * this very unlikely to happen. Alternatively, specialized {@link Document} creation methods,
       * such as createHTMLDocument
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#DOM2HTML DOM Level 2 HTML},
       * can be used to obtain specific types of {@link Document} objects.
       *
       * __It behaves slightly different from the description in the living standard__:
       * - There is no interface/class `XMLDocument`, it returns a `Document`
       * instance (with it's `type` set to `'xml'`).
       * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
       *
       * @function DOMImplementation.createDocument
       * @param {string | null} namespaceURI
       * The
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-namespaceURI namespace URI}
       * of the document element to create or null.
       * @param {string | null} qualifiedName
       * The
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-qualifiedname qualified name}
       * of the document element to be created or null.
       * @param {DocumentType | null} [doctype=null]
       * The type of document to be created or null. When doctype is not null, its
       * {@link Node#ownerDocument} attribute is set to the document being created. Default is
       * `null`
       * @returns {Document}
       * A new {@link Document} object with its document element. If the NamespaceURI,
       * qualifiedName, and doctype are null, the returned {@link Document} is empty with no
       * document element.
       * @throws {DOMException}
       * With code:
       *
       * - `INVALID_CHARACTER_ERR`: Raised if the specified qualified name is not an XML name
       * according to {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#XML XML 1.0}.
       * - `NAMESPACE_ERR`: Raised if the qualifiedName is malformed, if the qualifiedName has a
       * prefix and the namespaceURI is null, or if the qualifiedName is null and the namespaceURI
       * is different from null, or if the qualifiedName has a prefix that is "xml" and the
       * namespaceURI is different from "{@link http://www.w3.org/XML/1998/namespace}"
       * {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#Namespaces XML Namespaces},
       * or if the DOM implementation does not support the "XML" feature but a non-null namespace
       * URI was provided, since namespaces were defined by XML.
       * - `WRONG_DOCUMENT_ERR`: Raised if doctype has already been used with a different document
       * or was created from a different implementation.
       * - `NOT_SUPPORTED_ERR`: May be raised if the implementation does not support the feature
       * "XML" and the language exposed through the Document does not support XML Namespaces (such
       * as {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#HTML40 HTML 4.01}).
       * @since DOM Level 2.
       * @see {@link #createHTMLDocument}
       * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument DOM Living Standard
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Level-2-Core-DOM-createDocument DOM
       *      Level 3 Core
       * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM
       *      Level 2 Core (initial)
       */
      createDocument: function(namespaceURI, qualifiedName, doctype) {
        var contentType = MIME_TYPE.XML_APPLICATION;
        if (namespaceURI === NAMESPACE.HTML) {
          contentType = MIME_TYPE.XML_XHTML_APPLICATION;
        } else if (namespaceURI === NAMESPACE.SVG) {
          contentType = MIME_TYPE.XML_SVG_IMAGE;
        }
        var doc = new Document(PDC, { contentType });
        doc.implementation = this;
        doc.childNodes = new NodeList();
        doc.doctype = doctype || null;
        if (doctype) {
          doc.appendChild(doctype);
        }
        if (qualifiedName) {
          var root = doc.createElementNS(namespaceURI, qualifiedName);
          doc.appendChild(root);
        }
        return doc;
      },
      /**
       * Creates an empty DocumentType node. Entity declarations and notations are not made
       * available. Entity reference expansions and default attribute additions do not occur.
       *
       * **This behavior is slightly different from the one in the specs**:
       * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
       * - `publicId` and `systemId` contain the raw data including any possible quotes,
       *   so they can always be serialized back to the original value
       * - `internalSubset` contains the raw string between `[` and `]` if present,
       *   but is not parsed or validated in any form.
       *
       * @function DOMImplementation#createDocumentType
       * @param {string} qualifiedName
       * The {@link https://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-qualifiedname qualified
       * name} of the document type to be created.
       * @param {string} [publicId]
       * The external subset public identifier.
       * @param {string} [systemId]
       * The external subset system identifier.
       * @param {string} [internalSubset]
       * the internal subset or an empty string if it is not present
       * @returns {DocumentType}
       * A new {@link DocumentType} node with {@link Node#ownerDocument} set to null.
       * @throws {DOMException}
       * With code:
       *
       * - `INVALID_CHARACTER_ERR`: Raised if the specified qualified name is not an XML name
       * according to {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#XML XML 1.0}.
       * - `NAMESPACE_ERR`: Raised if the qualifiedName is malformed.
       * - `NOT_SUPPORTED_ERR`: May be raised if the implementation does not support the feature
       * "XML" and the language exposed through the Document does not support XML Namespaces (such
       * as {@link https://www.w3.org/TR/DOM-Level-3-Core/references.html#HTML40 HTML 4.01}).
       * @since DOM Level 2.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType
       *      MDN
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living
       *      Standard
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Level-3-Core-DOM-createDocType DOM
       *      Level 3 Core
       * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM
       *      Level 2 Core
       * @see https://github.com/xmldom/xmldom/blob/master/CHANGELOG.md#050
       * @see https://www.w3.org/TR/DOM-Level-2-Core/#core-ID-Core-DocType-internalSubset
       * @prettierignore
       */
      createDocumentType: function(qualifiedName, publicId, systemId, internalSubset) {
        validateQualifiedName(qualifiedName);
        var node = new DocumentType(PDC);
        node.name = qualifiedName;
        node.nodeName = qualifiedName;
        node.publicId = publicId || "";
        node.systemId = systemId || "";
        node.internalSubset = internalSubset || "";
        node.childNodes = new NodeList();
        return node;
      },
      /**
       * Returns an HTML document, that might already have a basic DOM structure.
       *
       * __It behaves slightly different from the description in the living standard__:
       * - If the first argument is `false` no initial nodes are added (steps 3-7 in the specs are
       * omitted)
       * - `encoding`, `mode`, `origin`, `url` fields are currently not declared.
       *
       * @param {string | false} [title]
       * A string containing the title to give the new HTML document.
       * @returns {Document}
       * The HTML document.
       * @since WHATWG Living Standard.
       * @see {@link #createDocument}
       * @see https://dom.spec.whatwg.org/#dom-domimplementation-createhtmldocument
       * @see https://dom.spec.whatwg.org/#html-document
       */
      createHTMLDocument: function(title) {
        var doc = new Document(PDC, { contentType: MIME_TYPE.HTML });
        doc.implementation = this;
        doc.childNodes = new NodeList();
        if (title !== false) {
          doc.doctype = this.createDocumentType("html");
          doc.doctype.ownerDocument = doc;
          doc.appendChild(doc.doctype);
          var htmlNode = doc.createElement("html");
          doc.appendChild(htmlNode);
          var headNode = doc.createElement("head");
          htmlNode.appendChild(headNode);
          if (typeof title === "string") {
            var titleNode = doc.createElement("title");
            titleNode.appendChild(doc.createTextNode(title));
            headNode.appendChild(titleNode);
          }
          htmlNode.appendChild(doc.createElement("body"));
        }
        return doc;
      }
    };
    function Node(symbol) {
      checkSymbol(symbol);
    }
    Node.prototype = {
      /**
       * The first child of this node.
       *
       * @type {Node | null}
       */
      firstChild: null,
      /**
       * The last child of this node.
       *
       * @type {Node | null}
       */
      lastChild: null,
      /**
       * The previous sibling of this node.
       *
       * @type {Node | null}
       */
      previousSibling: null,
      /**
       * The next sibling of this node.
       *
       * @type {Node | null}
       */
      nextSibling: null,
      /**
       * The parent node of this node.
       *
       * @type {Node | null}
       */
      parentNode: null,
      /**
       * The parent element of this node.
       *
       * @type {Element | null}
       */
      get parentElement() {
        return this.parentNode && this.parentNode.nodeType === this.ELEMENT_NODE ? this.parentNode : null;
      },
      /**
       * The child nodes of this node.
       *
       * @type {NodeList}
       */
      childNodes: null,
      /**
       * The document object associated with this node.
       *
       * @type {Document | null}
       */
      ownerDocument: null,
      /**
       * The value of this node.
       *
       * @type {string | null}
       */
      nodeValue: null,
      /**
       * The namespace URI of this node.
       *
       * @type {string | null}
       */
      namespaceURI: null,
      /**
       * The prefix of the namespace for this node.
       *
       * @type {string | null}
       */
      prefix: null,
      /**
       * The local part of the qualified name of this node.
       *
       * @type {string | null}
       */
      localName: null,
      /**
       * The baseURI is currently always `about:blank`,
       * since that's what happens when you create a document from scratch.
       *
       * @type {'about:blank'}
       */
      baseURI: "about:blank",
      /**
       * Is true if this node is part of a document.
       *
       * @type {boolean}
       */
      get isConnected() {
        var rootNode = this.getRootNode();
        return rootNode && rootNode.nodeType === rootNode.DOCUMENT_NODE;
      },
      /**
       * Checks whether `other` is an inclusive descendant of this node.
       *
       * @param {Node | null | undefined} other
       * The node to check.
       * @returns {boolean}
       * True if `other` is an inclusive descendant of this node; false otherwise.
       * @see https://dom.spec.whatwg.org/#dom-node-contains
       */
      contains: function(other) {
        if (!other) return false;
        var parent = other;
        do {
          if (this === parent) return true;
          parent = other.parentNode;
        } while (parent);
        return false;
      },
      /**
       * @typedef GetRootNodeOptions
       * @property {boolean} [composed=false]
       */
      /**
       * Searches for the root node of this node.
       *
       * **This behavior is slightly different from the in the specs**:
       * - ignores `options.composed`, since `ShadowRoot`s are unsupported, always returns root.
       *
       * @param {GetRootNodeOptions} [options]
       * @returns {Node}
       * Root node.
       * @see https://dom.spec.whatwg.org/#dom-node-getrootnode
       * @see https://dom.spec.whatwg.org/#concept-shadow-including-root
       */
      getRootNode: function(options) {
        var parent = this;
        do {
          if (!parent.parentNode) {
            return parent;
          }
          parent = parent.parentNode;
        } while (parent);
      },
      /**
       * Checks whether the given node is equal to this node.
       *
       * @param {Node} [otherNode]
       * @see https://dom.spec.whatwg.org/#concept-node-equals
       */
      isEqualNode: function(otherNode) {
        if (!otherNode) return false;
        if (this.nodeType !== otherNode.nodeType) return false;
        switch (this.nodeType) {
          case this.DOCUMENT_TYPE_NODE:
            if (this.name !== otherNode.name) return false;
            if (this.publicId !== otherNode.publicId) return false;
            if (this.systemId !== otherNode.systemId) return false;
            break;
          case this.ELEMENT_NODE:
            if (this.namespaceURI !== otherNode.namespaceURI) return false;
            if (this.prefix !== otherNode.prefix) return false;
            if (this.localName !== otherNode.localName) return false;
            if (this.attributes.length !== otherNode.attributes.length) return false;
            for (var i = 0; i < this.attributes.length; i++) {
              var attr = this.attributes.item(i);
              if (!attr.isEqualNode(otherNode.getAttributeNodeNS(attr.namespaceURI, attr.localName))) {
                return false;
              }
            }
            break;
          case this.ATTRIBUTE_NODE:
            if (this.namespaceURI !== otherNode.namespaceURI) return false;
            if (this.localName !== otherNode.localName) return false;
            if (this.value !== otherNode.value) return false;
            break;
          case this.PROCESSING_INSTRUCTION_NODE:
            if (this.target !== otherNode.target || this.data !== otherNode.data) {
              return false;
            }
            break;
          case this.TEXT_NODE:
          case this.COMMENT_NODE:
            if (this.data !== otherNode.data) return false;
            break;
        }
        if (this.childNodes.length !== otherNode.childNodes.length) {
          return false;
        }
        for (var i = 0; i < this.childNodes.length; i++) {
          if (!this.childNodes[i].isEqualNode(otherNode.childNodes[i])) {
            return false;
          }
        }
        return true;
      },
      /**
       * Checks whether or not the given node is this node.
       *
       * @param {Node} [otherNode]
       */
      isSameNode: function(otherNode) {
        return this === otherNode;
      },
      /**
       * Inserts a node before a reference node as a child of this node.
       *
       * @param {Node} newChild
       * The new child node to be inserted.
       * @param {Node | null} refChild
       * The reference node before which newChild will be inserted.
       * @returns {Node}
       * The new child node successfully inserted.
       * @throws {DOMException}
       * Throws a DOMException if inserting the node would result in a DOM tree that is not
       * well-formed, or if `child` is provided but is not a child of `parent`.
       * See {@link _insertBefore} for more details.
       * @since Modified in DOM L2
       */
      insertBefore: function(newChild, refChild) {
        return _insertBefore(this, newChild, refChild);
      },
      /**
       * Replaces an old child node with a new child node within this node.
       *
       * @param {Node} newChild
       * The new node that is to replace the old node.
       * If it already exists in the DOM, it is removed from its original position.
       * @param {Node} oldChild
       * The existing child node to be replaced.
       * @returns {Node}
       * Returns the replaced child node.
       * @throws {DOMException}
       * Throws a DOMException if replacing the node would result in a DOM tree that is not
       * well-formed, or if `oldChild` is not a child of `this`.
       * This can also occur if the pre-replacement validity assertion fails.
       * See {@link _insertBefore}, {@link Node.removeChild}, and
       * {@link assertPreReplacementValidityInDocument} for more details.
       * @see https://dom.spec.whatwg.org/#concept-node-replace
       */
      replaceChild: function(newChild, oldChild) {
        _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
        if (oldChild) {
          this.removeChild(oldChild);
        }
      },
      /**
       * Removes an existing child node from this node.
       *
       * @param {Node} oldChild
       * The child node to be removed.
       * @returns {Node}
       * Returns the removed child node.
       * @throws {DOMException}
       * Throws a DOMException if `oldChild` is not a child of `this`.
       * See {@link _removeChild} for more details.
       */
      removeChild: function(oldChild) {
        return _removeChild(this, oldChild);
      },
      /**
       * Appends a child node to this node.
       *
       * @param {Node} newChild
       * The child node to be appended to this node.
       * If it already exists in the DOM, it is removed from its original position.
       * @returns {Node}
       * Returns the appended child node.
       * @throws {DOMException}
       * Throws a DOMException if appending the node would result in a DOM tree that is not
       * well-formed, or if `newChild` is not a valid Node.
       * See {@link insertBefore} for more details.
       */
      appendChild: function(newChild) {
        return this.insertBefore(newChild, null);
      },
      /**
       * Determines whether this node has any child nodes.
       *
       * @returns {boolean}
       * Returns true if this node has any child nodes, and false otherwise.
       */
      hasChildNodes: function() {
        return this.firstChild != null;
      },
      /**
       * Creates a copy of the calling node.
       *
       * @param {boolean} deep
       * If true, the contents of the node are recursively copied.
       * If false, only the node itself (and its attributes, if it is an element) are copied.
       * @returns {Node}
       * Returns the newly created copy of the node.
       * @throws {DOMException}
       * May throw a DOMException if operations within {@link Element#setAttributeNode} or
       * {@link Node#appendChild} (which are potentially invoked in this method) do not meet their
       * specific constraints.
       * @see {@link cloneNode}
       */
      cloneNode: function(deep) {
        return cloneNode(this.ownerDocument || this, this, deep);
      },
      /**
       * Puts the specified node and all of its subtree into a "normalized" form. In a normalized
       * subtree, no text nodes in the subtree are empty and there are no adjacent text nodes.
       *
       * Specifically, this method merges any adjacent text nodes (i.e., nodes for which `nodeType`
       * is `TEXT_NODE`) into a single node with the combined data. It also removes any empty text
       * nodes.
       *
       * This method operates recursively, so it also normalizes any and all descendent nodes within
       * the subtree.
       *
       * @throws {DOMException}
       * May throw a DOMException if operations within removeChild or appendData (which are
       * potentially invoked in this method) do not meet their specific constraints.
       * @since Modified in DOM Level 2
       * @see {@link Node.removeChild}
       * @see {@link CharacterData.appendData}
       */
      normalize: function() {
        var child = this.firstChild;
        while (child) {
          var next = child.nextSibling;
          if (next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE) {
            this.removeChild(next);
            child.appendData(next.data);
          } else {
            child.normalize();
            child = next;
          }
        }
      },
      /**
       * Checks whether the DOM implementation implements a specific feature and its version.
       *
       * @deprecated
       * Since `DOMImplementation.hasFeature` is deprecated and always returns true.
       * @param {string} feature
       * The package name of the feature to test. This is the same name that can be passed to the
       * method `hasFeature` on `DOMImplementation`.
       * @param {string} version
       * This is the version number of the package name to test.
       * @returns {boolean}
       * Returns true in all cases in the current implementation.
       * @since Introduced in DOM Level 2
       * @see {@link DOMImplementation.hasFeature}
       */
      isSupported: function(feature, version2) {
        return this.ownerDocument.implementation.hasFeature(feature, version2);
      },
      /**
       * Look up the prefix associated to the given namespace URI, starting from this node.
       * **The default namespace declarations are ignored by this method.**
       * See Namespace Prefix Lookup for details on the algorithm used by this method.
       *
       * **This behavior is different from the in the specs**:
       * - no node type specific handling
       * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
       *
       * @param {string | null} namespaceURI
       * The namespace URI for which to find the associated prefix.
       * @returns {string | null}
       * The associated prefix, if found; otherwise, null.
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
       * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
       * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
       * @see https://github.com/xmldom/xmldom/issues/322
       * @prettierignore
       */
      lookupPrefix: function(namespaceURI) {
        var el = this;
        while (el) {
          var map = el._nsMap;
          if (map) {
            for (var n in map) {
              if (hasOwn(map, n) && map[n] === namespaceURI) {
                return n;
              }
            }
          }
          el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
        }
        return null;
      },
      /**
       * This function is used to look up the namespace URI associated with the given prefix,
       * starting from this node.
       *
       * **This behavior is different from the in the specs**:
       * - no node type specific handling
       * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
       *
       * @param {string | null} prefix
       * The prefix for which to find the associated namespace URI.
       * @returns {string | null}
       * The associated namespace URI, if found; otherwise, null.
       * @since DOM Level 3
       * @see https://dom.spec.whatwg.org/#dom-node-lookupnamespaceuri
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespaceURI
       * @prettierignore
       */
      lookupNamespaceURI: function(prefix) {
        var el = this;
        while (el) {
          var map = el._nsMap;
          if (map) {
            if (hasOwn(map, prefix)) {
              return map[prefix];
            }
          }
          el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
        }
        return null;
      },
      /**
       * Determines whether the given namespace URI is the default namespace.
       *
       * The function works by looking up the prefix associated with the given namespace URI. If no
       * prefix is found (i.e., the namespace URI is not registered in the namespace map of this
       * node or any of its ancestors), it returns `true`, implying the namespace URI is considered
       * the default.
       *
       * **This behavior is different from the in the specs**:
       * - no node type specific handling
       * - uses the internal attribute _nsMap for resolving namespaces that is updated when changing attributes
       *
       * @param {string | null} namespaceURI
       * The namespace URI to be checked.
       * @returns {boolean}
       * Returns true if the given namespace URI is the default namespace, false otherwise.
       * @since DOM Level 3
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-isDefaultNamespace
       * @see https://dom.spec.whatwg.org/#dom-node-isdefaultnamespace
       * @prettierignore
       */
      isDefaultNamespace: function(namespaceURI) {
        var prefix = this.lookupPrefix(namespaceURI);
        return prefix == null;
      },
      /**
       * Compares the reference node with a node with regard to their position in the document and
       * according to the document order.
       *
       * @param {Node} other
       * The node to compare the reference node to.
       * @returns {number}
       * Returns how the node is positioned relatively to the reference node according to the
       * bitmask. 0 if reference node and given node are the same.
       * @since DOM Level 3
       * @see https://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#Node3-compare
       * @see https://dom.spec.whatwg.org/#dom-node-comparedocumentposition
       */
      compareDocumentPosition: function(other) {
        if (this === other) return 0;
        var node1 = other;
        var node2 = this;
        var attr1 = null;
        var attr2 = null;
        if (node1 instanceof Attr) {
          attr1 = node1;
          node1 = attr1.ownerElement;
        }
        if (node2 instanceof Attr) {
          attr2 = node2;
          node2 = attr2.ownerElement;
          if (attr1 && node1 && node2 === node1) {
            for (var i = 0, attr; attr = node2.attributes[i]; i++) {
              if (attr === attr1)
                return DocumentPosition.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + DocumentPosition.DOCUMENT_POSITION_PRECEDING;
              if (attr === attr2)
                return DocumentPosition.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
            }
          }
        }
        if (!node1 || !node2 || node2.ownerDocument !== node1.ownerDocument) {
          return DocumentPosition.DOCUMENT_POSITION_DISCONNECTED + DocumentPosition.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + (docGUID(node2.ownerDocument) > docGUID(node1.ownerDocument) ? DocumentPosition.DOCUMENT_POSITION_FOLLOWING : DocumentPosition.DOCUMENT_POSITION_PRECEDING);
        }
        if (attr2 && node1 === node2) {
          return DocumentPosition.DOCUMENT_POSITION_CONTAINS + DocumentPosition.DOCUMENT_POSITION_PRECEDING;
        }
        if (attr1 && node1 === node2) {
          return DocumentPosition.DOCUMENT_POSITION_CONTAINED_BY + DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
        }
        var chain1 = [];
        var ancestor1 = node1.parentNode;
        while (ancestor1) {
          if (!attr2 && ancestor1 === node2) {
            return DocumentPosition.DOCUMENT_POSITION_CONTAINED_BY + DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
          }
          chain1.push(ancestor1);
          ancestor1 = ancestor1.parentNode;
        }
        chain1.reverse();
        var chain2 = [];
        var ancestor2 = node2.parentNode;
        while (ancestor2) {
          if (!attr1 && ancestor2 === node1) {
            return DocumentPosition.DOCUMENT_POSITION_CONTAINS + DocumentPosition.DOCUMENT_POSITION_PRECEDING;
          }
          chain2.push(ancestor2);
          ancestor2 = ancestor2.parentNode;
        }
        chain2.reverse();
        var ca = commonAncestor(chain1, chain2);
        for (var n in ca.childNodes) {
          var child = ca.childNodes[n];
          if (child === node2) return DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
          if (child === node1) return DocumentPosition.DOCUMENT_POSITION_PRECEDING;
          if (chain2.indexOf(child) >= 0) return DocumentPosition.DOCUMENT_POSITION_FOLLOWING;
          if (chain1.indexOf(child) >= 0) return DocumentPosition.DOCUMENT_POSITION_PRECEDING;
        }
        return 0;
      }
    };
    function _xmlEncoder(c) {
      return c == "<" && "&lt;" || c == ">" && "&gt;" || c == "&" && "&amp;" || c == '"' && "&quot;" || "&#" + c.charCodeAt() + ";";
    }
    copy(NodeType, Node);
    copy(NodeType, Node.prototype);
    copy(DocumentPosition, Node);
    copy(DocumentPosition, Node.prototype);
    function _visitNode(node, callback) {
      if (callback(node)) {
        return true;
      }
      if (node = node.firstChild) {
        do {
          if (_visitNode(node, callback)) {
            return true;
          }
        } while (node = node.nextSibling);
      }
    }
    function Document(symbol, options) {
      checkSymbol(symbol);
      var opt = options || {};
      this.ownerDocument = this;
      this.contentType = opt.contentType || MIME_TYPE.XML_APPLICATION;
      this.type = isHTMLMimeType(this.contentType) ? "html" : "xml";
    }
    function _onAddAttribute(doc, el, newAttr) {
      doc && doc._inc++;
      var ns = newAttr.namespaceURI;
      if (ns === NAMESPACE.XMLNS) {
        el._nsMap[newAttr.prefix ? newAttr.localName : ""] = newAttr.value;
      }
    }
    function _onRemoveAttribute(doc, el, newAttr, remove) {
      doc && doc._inc++;
      var ns = newAttr.namespaceURI;
      if (ns === NAMESPACE.XMLNS) {
        delete el._nsMap[newAttr.prefix ? newAttr.localName : ""];
      }
    }
    function _onUpdateChild(doc, parent, newChild) {
      if (doc && doc._inc) {
        doc._inc++;
        var childNodes = parent.childNodes;
        if (newChild && !newChild.nextSibling) {
          childNodes[childNodes.length++] = newChild;
        } else {
          var child = parent.firstChild;
          var i = 0;
          while (child) {
            childNodes[i++] = child;
            child = child.nextSibling;
          }
          childNodes.length = i;
          delete childNodes[childNodes.length];
        }
      }
    }
    function _removeChild(parentNode, child) {
      if (parentNode !== child.parentNode) {
        throw new DOMException(DOMException.NOT_FOUND_ERR, "child's parent is not parent");
      }
      var oldPreviousSibling = child.previousSibling;
      var oldNextSibling = child.nextSibling;
      if (oldPreviousSibling) {
        oldPreviousSibling.nextSibling = oldNextSibling;
      } else {
        parentNode.firstChild = oldNextSibling;
      }
      if (oldNextSibling) {
        oldNextSibling.previousSibling = oldPreviousSibling;
      } else {
        parentNode.lastChild = oldPreviousSibling;
      }
      _onUpdateChild(parentNode.ownerDocument, parentNode);
      child.parentNode = null;
      child.previousSibling = null;
      child.nextSibling = null;
      return child;
    }
    function hasValidParentNodeType(node) {
      return node && (node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.ELEMENT_NODE);
    }
    function hasInsertableNodeType(node) {
      return node && (node.nodeType === Node.CDATA_SECTION_NODE || node.nodeType === Node.COMMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.DOCUMENT_TYPE_NODE || node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.PROCESSING_INSTRUCTION_NODE || node.nodeType === Node.TEXT_NODE);
    }
    function isDocTypeNode(node) {
      return node && node.nodeType === Node.DOCUMENT_TYPE_NODE;
    }
    function isElementNode(node) {
      return node && node.nodeType === Node.ELEMENT_NODE;
    }
    function isTextNode(node) {
      return node && node.nodeType === Node.TEXT_NODE;
    }
    function isElementInsertionPossible(doc, child) {
      var parentChildNodes = doc.childNodes || [];
      if (find(parentChildNodes, isElementNode) || isDocTypeNode(child)) {
        return false;
      }
      var docTypeNode = find(parentChildNodes, isDocTypeNode);
      return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
    }
    function isElementReplacementPossible(doc, child) {
      var parentChildNodes = doc.childNodes || [];
      function hasElementChildThatIsNotChild(node) {
        return isElementNode(node) && node !== child;
      }
      if (find(parentChildNodes, hasElementChildThatIsNotChild)) {
        return false;
      }
      var docTypeNode = find(parentChildNodes, isDocTypeNode);
      return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
    }
    function assertPreInsertionValidity1to5(parent, node, child) {
      if (!hasValidParentNodeType(parent)) {
        throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Unexpected parent node type " + parent.nodeType);
      }
      if (child && child.parentNode !== parent) {
        throw new DOMException(DOMException.NOT_FOUND_ERR, "child not in parent");
      }
      if (
        // 4. If `node` is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
        !hasInsertableNodeType(node) || // 5. If either `node` is a Text node and `parent` is a document,
        // the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
        // || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
        // or `node` is a doctype and `parent` is not a document, then throw a "HierarchyRequestError" DOMException.
        isDocTypeNode(node) && parent.nodeType !== Node.DOCUMENT_NODE
      ) {
        throw new DOMException(
          DOMException.HIERARCHY_REQUEST_ERR,
          "Unexpected node type " + node.nodeType + " for parent node type " + parent.nodeType
        );
      }
    }
    function assertPreInsertionValidityInDocument(parent, node, child) {
      var parentChildNodes = parent.childNodes || [];
      var nodeChildNodes = node.childNodes || [];
      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        var nodeChildElements = nodeChildNodes.filter(isElementNode);
        if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
        }
        if (nodeChildElements.length === 1 && !isElementInsertionPossible(parent, child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
        }
      }
      if (isElementNode(node)) {
        if (!isElementInsertionPossible(parent, child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
        }
      }
      if (isDocTypeNode(node)) {
        if (find(parentChildNodes, isDocTypeNode)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
        }
        var parentElementChild = find(parentChildNodes, isElementNode);
        if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
        }
        if (!child && parentElementChild) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Doctype can not be appended since element is present");
        }
      }
    }
    function assertPreReplacementValidityInDocument(parent, node, child) {
      var parentChildNodes = parent.childNodes || [];
      var nodeChildNodes = node.childNodes || [];
      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        var nodeChildElements = nodeChildNodes.filter(isElementNode);
        if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "More than one element or text in fragment");
        }
        if (nodeChildElements.length === 1 && !isElementReplacementPossible(parent, child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Element in fragment can not be inserted before doctype");
        }
      }
      if (isElementNode(node)) {
        if (!isElementReplacementPossible(parent, child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one element can be added and only after doctype");
        }
      }
      if (isDocTypeNode(node)) {
        let hasDoctypeChildThatIsNotChild = function(node2) {
          return isDocTypeNode(node2) && node2 !== child;
        };
        if (find(parentChildNodes, hasDoctypeChildThatIsNotChild)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Only one doctype is allowed");
        }
        var parentElementChild = find(parentChildNodes, isElementNode);
        if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
          throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "Doctype can only be inserted before an element");
        }
      }
    }
    function _insertBefore(parent, node, child, _inDocumentAssertion) {
      assertPreInsertionValidity1to5(parent, node, child);
      if (parent.nodeType === Node.DOCUMENT_NODE) {
        (_inDocumentAssertion || assertPreInsertionValidityInDocument)(parent, node, child);
      }
      var cp = node.parentNode;
      if (cp) {
        cp.removeChild(node);
      }
      if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
        var newFirst = node.firstChild;
        if (newFirst == null) {
          return node;
        }
        var newLast = node.lastChild;
      } else {
        newFirst = newLast = node;
      }
      var pre = child ? child.previousSibling : parent.lastChild;
      newFirst.previousSibling = pre;
      newLast.nextSibling = child;
      if (pre) {
        pre.nextSibling = newFirst;
      } else {
        parent.firstChild = newFirst;
      }
      if (child == null) {
        parent.lastChild = newLast;
      } else {
        child.previousSibling = newLast;
      }
      do {
        newFirst.parentNode = parent;
      } while (newFirst !== newLast && (newFirst = newFirst.nextSibling));
      _onUpdateChild(parent.ownerDocument || parent, parent, node);
      if (node.nodeType == DOCUMENT_FRAGMENT_NODE) {
        node.firstChild = node.lastChild = null;
      }
      return node;
    }
    Document.prototype = {
      /**
       * The implementation that created this document.
       *
       * @type DOMImplementation
       * @readonly
       */
      implementation: null,
      nodeName: "#document",
      nodeType: DOCUMENT_NODE,
      /**
       * The DocumentType node of the document.
       *
       * @type DocumentType
       * @readonly
       */
      doctype: null,
      documentElement: null,
      _inc: 1,
      insertBefore: function(newChild, refChild) {
        if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
          var child = newChild.firstChild;
          while (child) {
            var next = child.nextSibling;
            this.insertBefore(child, refChild);
            child = next;
          }
          return newChild;
        }
        _insertBefore(this, newChild, refChild);
        newChild.ownerDocument = this;
        if (this.documentElement === null && newChild.nodeType === ELEMENT_NODE) {
          this.documentElement = newChild;
        }
        return newChild;
      },
      removeChild: function(oldChild) {
        var removed = _removeChild(this, oldChild);
        if (removed === this.documentElement) {
          this.documentElement = null;
        }
        return removed;
      },
      replaceChild: function(newChild, oldChild) {
        _insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
        newChild.ownerDocument = this;
        if (oldChild) {
          this.removeChild(oldChild);
        }
        if (isElementNode(newChild)) {
          this.documentElement = newChild;
        }
      },
      // Introduced in DOM Level 2:
      importNode: function(importedNode, deep) {
        return importNode(this, importedNode, deep);
      },
      // Introduced in DOM Level 2:
      getElementById: function(id) {
        var rtv = null;
        _visitNode(this.documentElement, function(node) {
          if (node.nodeType == ELEMENT_NODE) {
            if (node.getAttribute("id") == id) {
              rtv = node;
              return true;
            }
          }
        });
        return rtv;
      },
      /**
       * Creates a new `Element` that is owned by this `Document`.
       * In HTML Documents `localName` is the lower cased `tagName`,
       * otherwise no transformation is being applied.
       * When `contentType` implies the HTML namespace, it will be set as `namespaceURI`.
       *
       * __This implementation differs from the specification:__ - The provided name is not checked
       * against the `Name` production,
       * so no related error will be thrown.
       * - There is no interface `HTMLElement`, it is always an `Element`.
       * - There is no support for a second argument to indicate using custom elements.
       *
       * @param {string} tagName
       * @returns {Element}
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
       * @see https://dom.spec.whatwg.org/#dom-document-createelement
       * @see https://dom.spec.whatwg.org/#concept-create-element
       */
      createElement: function(tagName) {
        var node = new Element(PDC);
        node.ownerDocument = this;
        if (this.type === "html") {
          tagName = tagName.toLowerCase();
        }
        if (hasDefaultHTMLNamespace(this.contentType)) {
          node.namespaceURI = NAMESPACE.HTML;
        }
        node.nodeName = tagName;
        node.tagName = tagName;
        node.localName = tagName;
        node.childNodes = new NodeList();
        var attrs = node.attributes = new NamedNodeMap();
        attrs._ownerElement = node;
        return node;
      },
      /**
       * @returns {DocumentFragment}
       */
      createDocumentFragment: function() {
        var node = new DocumentFragment(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        return node;
      },
      /**
       * @param {string} data
       * @returns {Text}
       */
      createTextNode: function(data) {
        var node = new Text(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.appendData(data);
        return node;
      },
      /**
       * @param {string} data
       * @returns {Comment}
       */
      createComment: function(data) {
        var node = new Comment(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.appendData(data);
        return node;
      },
      /**
       * @param {string} data
       * @returns {CDATASection}
       */
      createCDATASection: function(data) {
        var node = new CDATASection(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.appendData(data);
        return node;
      },
      /**
       * @param {string} target
       * @param {string} data
       * @returns {ProcessingInstruction}
       */
      createProcessingInstruction: function(target, data) {
        var node = new ProcessingInstruction(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.nodeName = node.target = target;
        node.nodeValue = node.data = data;
        return node;
      },
      /**
       * Creates an `Attr` node that is owned by this document.
       * In HTML Documents `localName` is the lower cased `name`,
       * otherwise no transformation is being applied.
       *
       * __This implementation differs from the specification:__ - The provided name is not checked
       * against the `Name` production,
       * so no related error will be thrown.
       *
       * @param {string} name
       * @returns {Attr}
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createAttribute
       * @see https://dom.spec.whatwg.org/#dom-document-createattribute
       */
      createAttribute: function(name) {
        if (!g.QName_exact.test(name)) {
          throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'invalid character in name "' + name + '"');
        }
        if (this.type === "html") {
          name = name.toLowerCase();
        }
        return this._createAttribute(name);
      },
      _createAttribute: function(name) {
        var node = new Attr(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.name = name;
        node.nodeName = name;
        node.localName = name;
        node.specified = true;
        return node;
      },
      /**
       * Creates an EntityReference object.
       * The current implementation does not fill the `childNodes` with those of the corresponding
       * `Entity`
       *
       * @deprecated
       * In DOM Level 4.
       * @param {string} name
       * The name of the entity to reference. No namespace well-formedness checks are performed.
       * @returns {EntityReference}
       * @throws {DOMException}
       * With code `INVALID_CHARACTER_ERR` when `name` is not valid.
       * @throws {DOMException}
       * with code `NOT_SUPPORTED_ERR` when the document is of type `html`
       * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-392B75AE
       */
      createEntityReference: function(name) {
        if (!g.Name.test(name)) {
          throw new DOMException(DOMException.INVALID_CHARACTER_ERR, 'not a valid xml name "' + name + '"');
        }
        if (this.type === "html") {
          throw new DOMException("document is an html document", DOMExceptionName.NotSupportedError);
        }
        var node = new EntityReference(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.nodeName = name;
        return node;
      },
      // Introduced in DOM Level 2:
      /**
       * @param {string} namespaceURI
       * @param {string} qualifiedName
       * @returns {Element}
       */
      createElementNS: function(namespaceURI, qualifiedName) {
        var validated = validateAndExtract(namespaceURI, qualifiedName);
        var node = new Element(PDC);
        var attrs = node.attributes = new NamedNodeMap();
        node.childNodes = new NodeList();
        node.ownerDocument = this;
        node.nodeName = qualifiedName;
        node.tagName = qualifiedName;
        node.namespaceURI = validated[0];
        node.prefix = validated[1];
        node.localName = validated[2];
        attrs._ownerElement = node;
        return node;
      },
      // Introduced in DOM Level 2:
      /**
       * @param {string} namespaceURI
       * @param {string} qualifiedName
       * @returns {Attr}
       */
      createAttributeNS: function(namespaceURI, qualifiedName) {
        var validated = validateAndExtract(namespaceURI, qualifiedName);
        var node = new Attr(PDC);
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        node.nodeName = qualifiedName;
        node.name = qualifiedName;
        node.specified = true;
        node.namespaceURI = validated[0];
        node.prefix = validated[1];
        node.localName = validated[2];
        return node;
      }
    };
    _extends(Document, Node);
    function Element(symbol) {
      checkSymbol(symbol);
      this._nsMap = /* @__PURE__ */ Object.create(null);
    }
    Element.prototype = {
      nodeType: ELEMENT_NODE,
      /**
       * The attributes of this element.
       *
       * @type {NamedNodeMap | null}
       */
      attributes: null,
      getQualifiedName: function() {
        return this.prefix ? this.prefix + ":" + this.localName : this.localName;
      },
      _isInHTMLDocumentAndNamespace: function() {
        return this.ownerDocument.type === "html" && this.namespaceURI === NAMESPACE.HTML;
      },
      /**
       * Implementaton of Level2 Core function hasAttributes.
       *
       * @returns {boolean}
       * True if attribute list is not empty.
       * @see https://www.w3.org/TR/DOM-Level-2-Core/#core-ID-NodeHasAttrs
       */
      hasAttributes: function() {
        return !!(this.attributes && this.attributes.length);
      },
      hasAttribute: function(name) {
        return !!this.getAttributeNode(name);
      },
      /**
       * Returns element’s first attribute whose qualified name is `name`, and `null`
       * if there is no such attribute.
       *
       * @param {string} name
       * @returns {string | null}
       */
      getAttribute: function(name) {
        var attr = this.getAttributeNode(name);
        return attr ? attr.value : null;
      },
      getAttributeNode: function(name) {
        if (this._isInHTMLDocumentAndNamespace()) {
          name = name.toLowerCase();
        }
        return this.attributes.getNamedItem(name);
      },
      /**
       * Sets the value of element’s first attribute whose qualified name is qualifiedName to value.
       *
       * @param {string} name
       * @param {string} value
       */
      setAttribute: function(name, value) {
        if (this._isInHTMLDocumentAndNamespace()) {
          name = name.toLowerCase();
        }
        var attr = this.getAttributeNode(name);
        if (attr) {
          attr.value = attr.nodeValue = "" + value;
        } else {
          attr = this.ownerDocument._createAttribute(name);
          attr.value = attr.nodeValue = "" + value;
          this.setAttributeNode(attr);
        }
      },
      removeAttribute: function(name) {
        var attr = this.getAttributeNode(name);
        attr && this.removeAttributeNode(attr);
      },
      setAttributeNode: function(newAttr) {
        return this.attributes.setNamedItem(newAttr);
      },
      setAttributeNodeNS: function(newAttr) {
        return this.attributes.setNamedItemNS(newAttr);
      },
      removeAttributeNode: function(oldAttr) {
        return this.attributes.removeNamedItem(oldAttr.nodeName);
      },
      //get real attribute name,and remove it by removeAttributeNode
      removeAttributeNS: function(namespaceURI, localName) {
        var old = this.getAttributeNodeNS(namespaceURI, localName);
        old && this.removeAttributeNode(old);
      },
      hasAttributeNS: function(namespaceURI, localName) {
        return this.getAttributeNodeNS(namespaceURI, localName) != null;
      },
      /**
       * Returns element’s attribute whose namespace is `namespaceURI` and local name is
       * `localName`,
       * or `null` if there is no such attribute.
       *
       * @param {string} namespaceURI
       * @param {string} localName
       * @returns {string | null}
       */
      getAttributeNS: function(namespaceURI, localName) {
        var attr = this.getAttributeNodeNS(namespaceURI, localName);
        return attr ? attr.value : null;
      },
      /**
       * Sets the value of element’s attribute whose namespace is `namespaceURI` and local name is
       * `localName` to value.
       *
       * @param {string} namespaceURI
       * @param {string} qualifiedName
       * @param {string} value
       * @see https://dom.spec.whatwg.org/#dom-element-setattributens
       */
      setAttributeNS: function(namespaceURI, qualifiedName, value) {
        var validated = validateAndExtract(namespaceURI, qualifiedName);
        var localName = validated[2];
        var attr = this.getAttributeNodeNS(namespaceURI, localName);
        if (attr) {
          attr.value = attr.nodeValue = "" + value;
        } else {
          attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
          attr.value = attr.nodeValue = "" + value;
          this.setAttributeNode(attr);
        }
      },
      getAttributeNodeNS: function(namespaceURI, localName) {
        return this.attributes.getNamedItemNS(namespaceURI, localName);
      },
      /**
       * Returns a LiveNodeList of all child elements which have **all** of the given class name(s).
       *
       * Returns an empty list if `classNames` is an empty string or only contains HTML white space
       * characters.
       *
       * Warning: This returns a live LiveNodeList.
       * Changes in the DOM will reflect in the array as the changes occur.
       * If an element selected by this array no longer qualifies for the selector,
       * it will automatically be removed. Be aware of this for iteration purposes.
       *
       * @param {string} classNames
       * Is a string representing the class name(s) to match; multiple class names are separated by
       * (ASCII-)whitespace.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
       * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
       */
      getElementsByClassName: function(classNames) {
        var classNamesSet = toOrderedSet(classNames);
        return new LiveNodeList(this, function(base) {
          var ls = [];
          if (classNamesSet.length > 0) {
            _visitNode(base, function(node) {
              if (node !== base && node.nodeType === ELEMENT_NODE) {
                var nodeClassNames = node.getAttribute("class");
                if (nodeClassNames) {
                  var matches = classNames === nodeClassNames;
                  if (!matches) {
                    var nodeClassNamesSet = toOrderedSet(nodeClassNames);
                    matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet));
                  }
                  if (matches) {
                    ls.push(node);
                  }
                }
              }
            });
          }
          return ls;
        });
      },
      /**
       * Returns a LiveNodeList of elements with the given qualifiedName.
       * Searching for all descendants can be done by passing `*` as `qualifiedName`.
       *
       * All descendants of the specified element are searched, but not the element itself.
       * The returned list is live, which means it updates itself with the DOM tree automatically.
       * Therefore, there is no need to call `Element.getElementsByTagName()`
       * with the same element and arguments repeatedly if the DOM changes in between calls.
       *
       * When called on an HTML element in an HTML document,
       * `getElementsByTagName` lower-cases the argument before searching for it.
       * This is undesirable when trying to match camel-cased SVG elements (such as
       * `<linearGradient>`) in an HTML document.
       * Instead, use `Element.getElementsByTagNameNS()`,
       * which preserves the capitalization of the tag name.
       *
       * `Element.getElementsByTagName` is similar to `Document.getElementsByTagName()`,
       * except that it only searches for elements that are descendants of the specified element.
       *
       * @param {string} qualifiedName
       * @returns {LiveNodeList}
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
       * @see https://dom.spec.whatwg.org/#concept-getelementsbytagname
       */
      getElementsByTagName: function(qualifiedName) {
        var isHTMLDocument = (this.nodeType === DOCUMENT_NODE ? this : this.ownerDocument).type === "html";
        var lowerQualifiedName = qualifiedName.toLowerCase();
        return new LiveNodeList(this, function(base) {
          var ls = [];
          _visitNode(base, function(node) {
            if (node === base || node.nodeType !== ELEMENT_NODE) {
              return;
            }
            if (qualifiedName === "*") {
              ls.push(node);
            } else {
              var nodeQualifiedName = node.getQualifiedName();
              var matchingQName = isHTMLDocument && node.namespaceURI === NAMESPACE.HTML ? lowerQualifiedName : qualifiedName;
              if (nodeQualifiedName === matchingQName) {
                ls.push(node);
              }
            }
          });
          return ls;
        });
      },
      getElementsByTagNameNS: function(namespaceURI, localName) {
        return new LiveNodeList(this, function(base) {
          var ls = [];
          _visitNode(base, function(node) {
            if (node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === "*" || node.namespaceURI === namespaceURI) && (localName === "*" || node.localName == localName)) {
              ls.push(node);
            }
          });
          return ls;
        });
      }
    };
    Document.prototype.getElementsByClassName = Element.prototype.getElementsByClassName;
    Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
    Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;
    _extends(Element, Node);
    function Attr(symbol) {
      checkSymbol(symbol);
      this.namespaceURI = null;
      this.prefix = null;
      this.ownerElement = null;
    }
    Attr.prototype.nodeType = ATTRIBUTE_NODE;
    _extends(Attr, Node);
    function CharacterData(symbol) {
      checkSymbol(symbol);
    }
    CharacterData.prototype = {
      data: "",
      substringData: function(offset, count) {
        return this.data.substring(offset, offset + count);
      },
      appendData: function(text) {
        text = this.data + text;
        this.nodeValue = this.data = text;
        this.length = text.length;
      },
      insertData: function(offset, text) {
        this.replaceData(offset, 0, text);
      },
      deleteData: function(offset, count) {
        this.replaceData(offset, count, "");
      },
      replaceData: function(offset, count, text) {
        var start = this.data.substring(0, offset);
        var end = this.data.substring(offset + count);
        text = start + text + end;
        this.nodeValue = this.data = text;
        this.length = text.length;
      }
    };
    _extends(CharacterData, Node);
    function Text(symbol) {
      checkSymbol(symbol);
    }
    Text.prototype = {
      nodeName: "#text",
      nodeType: TEXT_NODE,
      splitText: function(offset) {
        var text = this.data;
        var newText = text.substring(offset);
        text = text.substring(0, offset);
        this.data = this.nodeValue = text;
        this.length = text.length;
        var newNode = this.ownerDocument.createTextNode(newText);
        if (this.parentNode) {
          this.parentNode.insertBefore(newNode, this.nextSibling);
        }
        return newNode;
      }
    };
    _extends(Text, CharacterData);
    function Comment(symbol) {
      checkSymbol(symbol);
    }
    Comment.prototype = {
      nodeName: "#comment",
      nodeType: COMMENT_NODE
    };
    _extends(Comment, CharacterData);
    function CDATASection(symbol) {
      checkSymbol(symbol);
    }
    CDATASection.prototype = {
      nodeName: "#cdata-section",
      nodeType: CDATA_SECTION_NODE
    };
    _extends(CDATASection, Text);
    function DocumentType(symbol) {
      checkSymbol(symbol);
    }
    DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
    _extends(DocumentType, Node);
    function Notation(symbol) {
      checkSymbol(symbol);
    }
    Notation.prototype.nodeType = NOTATION_NODE;
    _extends(Notation, Node);
    function Entity(symbol) {
      checkSymbol(symbol);
    }
    Entity.prototype.nodeType = ENTITY_NODE;
    _extends(Entity, Node);
    function EntityReference(symbol) {
      checkSymbol(symbol);
    }
    EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
    _extends(EntityReference, Node);
    function DocumentFragment(symbol) {
      checkSymbol(symbol);
    }
    DocumentFragment.prototype.nodeName = "#document-fragment";
    DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE;
    _extends(DocumentFragment, Node);
    function ProcessingInstruction(symbol) {
      checkSymbol(symbol);
    }
    ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
    _extends(ProcessingInstruction, CharacterData);
    function XMLSerializer() {
    }
    XMLSerializer.prototype.serializeToString = function(node, nodeFilter) {
      return nodeSerializeToString.call(node, nodeFilter);
    };
    Node.prototype.toString = nodeSerializeToString;
    function nodeSerializeToString(nodeFilter) {
      var buf = [];
      var refNode = this.nodeType === DOCUMENT_NODE && this.documentElement || this;
      var prefix = refNode.prefix;
      var uri = refNode.namespaceURI;
      if (uri && prefix == null) {
        var prefix = refNode.lookupPrefix(uri);
        if (prefix == null) {
          var visibleNamespaces = [
            { namespace: uri, prefix: null }
            //{namespace:uri,prefix:''}
          ];
        }
      }
      serializeToString(this, buf, nodeFilter, visibleNamespaces);
      return buf.join("");
    }
    function needNamespaceDefine(node, isHTML, visibleNamespaces) {
      var prefix = node.prefix || "";
      var uri = node.namespaceURI;
      if (!uri) {
        return false;
      }
      if (prefix === "xml" && uri === NAMESPACE.XML || uri === NAMESPACE.XMLNS) {
        return false;
      }
      var i = visibleNamespaces.length;
      while (i--) {
        var ns = visibleNamespaces[i];
        if (ns.prefix === prefix) {
          return ns.namespace !== uri;
        }
      }
      return true;
    }
    function addSerializedAttribute(buf, qualifiedName, value) {
      buf.push(" ", qualifiedName, '="', value.replace(/[<>&"\t\n\r]/g, _xmlEncoder), '"');
    }
    function serializeToString(node, buf, nodeFilter, visibleNamespaces) {
      if (!visibleNamespaces) {
        visibleNamespaces = [];
      }
      var doc = node.nodeType === DOCUMENT_NODE ? node : node.ownerDocument;
      var isHTML = doc.type === "html";
      if (nodeFilter) {
        node = nodeFilter(node);
        if (node) {
          if (typeof node == "string") {
            buf.push(node);
            return;
          }
        } else {
          return;
        }
      }
      switch (node.nodeType) {
        case ELEMENT_NODE:
          var attrs = node.attributes;
          var len = attrs.length;
          var child = node.firstChild;
          var nodeName = node.tagName;
          var prefixedNodeName = nodeName;
          if (!isHTML && !node.prefix && node.namespaceURI) {
            var defaultNS;
            for (var ai = 0; ai < attrs.length; ai++) {
              if (attrs.item(ai).name === "xmlns") {
                defaultNS = attrs.item(ai).value;
                break;
              }
            }
            if (!defaultNS) {
              for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
                var namespace = visibleNamespaces[nsi];
                if (namespace.prefix === "" && namespace.namespace === node.namespaceURI) {
                  defaultNS = namespace.namespace;
                  break;
                }
              }
            }
            if (defaultNS !== node.namespaceURI) {
              for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
                var namespace = visibleNamespaces[nsi];
                if (namespace.namespace === node.namespaceURI) {
                  if (namespace.prefix) {
                    prefixedNodeName = namespace.prefix + ":" + nodeName;
                  }
                  break;
                }
              }
            }
          }
          buf.push("<", prefixedNodeName);
          for (var i = 0; i < len; i++) {
            var attr = attrs.item(i);
            if (attr.prefix == "xmlns") {
              visibleNamespaces.push({
                prefix: attr.localName,
                namespace: attr.value
              });
            } else if (attr.nodeName == "xmlns") {
              visibleNamespaces.push({ prefix: "", namespace: attr.value });
            }
          }
          for (var i = 0; i < len; i++) {
            var attr = attrs.item(i);
            if (needNamespaceDefine(attr, isHTML, visibleNamespaces)) {
              var prefix = attr.prefix || "";
              var uri = attr.namespaceURI;
              addSerializedAttribute(buf, prefix ? "xmlns:" + prefix : "xmlns", uri);
              visibleNamespaces.push({ prefix, namespace: uri });
            }
            serializeToString(attr, buf, nodeFilter, visibleNamespaces);
          }
          if (nodeName === prefixedNodeName && needNamespaceDefine(node, isHTML, visibleNamespaces)) {
            var prefix = node.prefix || "";
            var uri = node.namespaceURI;
            addSerializedAttribute(buf, prefix ? "xmlns:" + prefix : "xmlns", uri);
            visibleNamespaces.push({ prefix, namespace: uri });
          }
          var canCloseTag = !child;
          if (canCloseTag && (isHTML || node.namespaceURI === NAMESPACE.HTML)) {
            canCloseTag = isHTMLVoidElement(nodeName);
          }
          if (canCloseTag) {
            buf.push("/>");
          } else {
            buf.push(">");
            if (isHTML && isHTMLRawTextElement(nodeName)) {
              while (child) {
                if (child.data) {
                  buf.push(child.data);
                } else {
                  serializeToString(child, buf, nodeFilter, visibleNamespaces.slice());
                }
                child = child.nextSibling;
              }
            } else {
              while (child) {
                serializeToString(child, buf, nodeFilter, visibleNamespaces.slice());
                child = child.nextSibling;
              }
            }
            buf.push("</", prefixedNodeName, ">");
          }
          return;
        case DOCUMENT_NODE:
        case DOCUMENT_FRAGMENT_NODE:
          var child = node.firstChild;
          while (child) {
            serializeToString(child, buf, nodeFilter, visibleNamespaces.slice());
            child = child.nextSibling;
          }
          return;
        case ATTRIBUTE_NODE:
          return addSerializedAttribute(buf, node.name, node.value);
        case TEXT_NODE:
          return buf.push(node.data.replace(/[<&>]/g, _xmlEncoder));
        case CDATA_SECTION_NODE:
          return buf.push(g.CDATA_START, node.data, g.CDATA_END);
        case COMMENT_NODE:
          return buf.push(g.COMMENT_START, node.data, g.COMMENT_END);
        case DOCUMENT_TYPE_NODE:
          var pubid = node.publicId;
          var sysid = node.systemId;
          buf.push(g.DOCTYPE_DECL_START, " ", node.name);
          if (pubid) {
            buf.push(" ", g.PUBLIC, " ", pubid);
            if (sysid && sysid !== ".") {
              buf.push(" ", sysid);
            }
          } else if (sysid && sysid !== ".") {
            buf.push(" ", g.SYSTEM, " ", sysid);
          }
          if (node.internalSubset) {
            buf.push(" [", node.internalSubset, "]");
          }
          buf.push(">");
          return;
        case PROCESSING_INSTRUCTION_NODE:
          return buf.push("<?", node.target, " ", node.data, "?>");
        case ENTITY_REFERENCE_NODE:
          return buf.push("&", node.nodeName, ";");
        //case ENTITY_NODE:
        //case NOTATION_NODE:
        default:
          buf.push("??", node.nodeName);
      }
    }
    function importNode(doc, node, deep) {
      var node2;
      switch (node.nodeType) {
        case ELEMENT_NODE:
          node2 = node.cloneNode(false);
          node2.ownerDocument = doc;
        //var attrs = node2.attributes;
        //var len = attrs.length;
        //for(var i=0;i<len;i++){
        //node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
        //}
        case DOCUMENT_FRAGMENT_NODE:
          break;
        case ATTRIBUTE_NODE:
          deep = true;
          break;
      }
      if (!node2) {
        node2 = node.cloneNode(false);
      }
      node2.ownerDocument = doc;
      node2.parentNode = null;
      if (deep) {
        var child = node.firstChild;
        while (child) {
          node2.appendChild(importNode(doc, child, deep));
          child = child.nextSibling;
        }
      }
      return node2;
    }
    function cloneNode(doc, node, deep) {
      var node2 = new node.constructor(PDC);
      for (var n in node) {
        if (hasOwn(node, n)) {
          var v = node[n];
          if (typeof v != "object") {
            if (v != node2[n]) {
              node2[n] = v;
            }
          }
        }
      }
      if (node.childNodes) {
        node2.childNodes = new NodeList();
      }
      node2.ownerDocument = doc;
      switch (node2.nodeType) {
        case ELEMENT_NODE:
          var attrs = node.attributes;
          var attrs2 = node2.attributes = new NamedNodeMap();
          var len = attrs.length;
          attrs2._ownerElement = node2;
          for (var i = 0; i < len; i++) {
            node2.setAttributeNode(cloneNode(doc, attrs.item(i), true));
          }
          break;
        case ATTRIBUTE_NODE:
          deep = true;
      }
      if (deep) {
        var child = node.firstChild;
        while (child) {
          node2.appendChild(cloneNode(doc, child, deep));
          child = child.nextSibling;
        }
      }
      return node2;
    }
    function __set__(object, key, value) {
      object[key] = value;
    }
    try {
      if (Object.defineProperty) {
        let getTextContent = function(node) {
          switch (node.nodeType) {
            case ELEMENT_NODE:
            case DOCUMENT_FRAGMENT_NODE:
              var buf = [];
              node = node.firstChild;
              while (node) {
                if (node.nodeType !== 7 && node.nodeType !== 8) {
                  buf.push(getTextContent(node));
                }
                node = node.nextSibling;
              }
              return buf.join("");
            default:
              return node.nodeValue;
          }
        };
        Object.defineProperty(LiveNodeList.prototype, "length", {
          get: function() {
            _updateLiveList(this);
            return this.$$length;
          }
        });
        Object.defineProperty(Node.prototype, "textContent", {
          get: function() {
            return getTextContent(this);
          },
          set: function(data) {
            switch (this.nodeType) {
              case ELEMENT_NODE:
              case DOCUMENT_FRAGMENT_NODE:
                while (this.firstChild) {
                  this.removeChild(this.firstChild);
                }
                if (data || String(data)) {
                  this.appendChild(this.ownerDocument.createTextNode(data));
                }
                break;
              default:
                this.data = data;
                this.value = data;
                this.nodeValue = data;
            }
          }
        });
        __set__ = function(object, key, value) {
          object["$$" + key] = value;
        };
      }
    } catch (e) {
    }
    exports2._updateLiveList = _updateLiveList;
    exports2.Attr = Attr;
    exports2.CDATASection = CDATASection;
    exports2.CharacterData = CharacterData;
    exports2.Comment = Comment;
    exports2.Document = Document;
    exports2.DocumentFragment = DocumentFragment;
    exports2.DocumentType = DocumentType;
    exports2.DOMImplementation = DOMImplementation;
    exports2.Element = Element;
    exports2.Entity = Entity;
    exports2.EntityReference = EntityReference;
    exports2.LiveNodeList = LiveNodeList;
    exports2.NamedNodeMap = NamedNodeMap;
    exports2.Node = Node;
    exports2.NodeList = NodeList;
    exports2.Notation = Notation;
    exports2.Text = Text;
    exports2.ProcessingInstruction = ProcessingInstruction;
    exports2.XMLSerializer = XMLSerializer;
  }
});

// node_modules/@xmldom/xmldom/lib/entities.js
var require_entities = __commonJS({
  "node_modules/@xmldom/xmldom/lib/entities.js"(exports2) {
    "use strict";
    var freeze = require_conventions().freeze;
    exports2.XML_ENTITIES = freeze({
      amp: "&",
      apos: "'",
      gt: ">",
      lt: "<",
      quot: '"'
    });
    exports2.HTML_ENTITIES = freeze({
      Aacute: "\xC1",
      aacute: "\xE1",
      Abreve: "\u0102",
      abreve: "\u0103",
      ac: "\u223E",
      acd: "\u223F",
      acE: "\u223E\u0333",
      Acirc: "\xC2",
      acirc: "\xE2",
      acute: "\xB4",
      Acy: "\u0410",
      acy: "\u0430",
      AElig: "\xC6",
      aelig: "\xE6",
      af: "\u2061",
      Afr: "\u{1D504}",
      afr: "\u{1D51E}",
      Agrave: "\xC0",
      agrave: "\xE0",
      alefsym: "\u2135",
      aleph: "\u2135",
      Alpha: "\u0391",
      alpha: "\u03B1",
      Amacr: "\u0100",
      amacr: "\u0101",
      amalg: "\u2A3F",
      AMP: "&",
      amp: "&",
      And: "\u2A53",
      and: "\u2227",
      andand: "\u2A55",
      andd: "\u2A5C",
      andslope: "\u2A58",
      andv: "\u2A5A",
      ang: "\u2220",
      ange: "\u29A4",
      angle: "\u2220",
      angmsd: "\u2221",
      angmsdaa: "\u29A8",
      angmsdab: "\u29A9",
      angmsdac: "\u29AA",
      angmsdad: "\u29AB",
      angmsdae: "\u29AC",
      angmsdaf: "\u29AD",
      angmsdag: "\u29AE",
      angmsdah: "\u29AF",
      angrt: "\u221F",
      angrtvb: "\u22BE",
      angrtvbd: "\u299D",
      angsph: "\u2222",
      angst: "\xC5",
      angzarr: "\u237C",
      Aogon: "\u0104",
      aogon: "\u0105",
      Aopf: "\u{1D538}",
      aopf: "\u{1D552}",
      ap: "\u2248",
      apacir: "\u2A6F",
      apE: "\u2A70",
      ape: "\u224A",
      apid: "\u224B",
      apos: "'",
      ApplyFunction: "\u2061",
      approx: "\u2248",
      approxeq: "\u224A",
      Aring: "\xC5",
      aring: "\xE5",
      Ascr: "\u{1D49C}",
      ascr: "\u{1D4B6}",
      Assign: "\u2254",
      ast: "*",
      asymp: "\u2248",
      asympeq: "\u224D",
      Atilde: "\xC3",
      atilde: "\xE3",
      Auml: "\xC4",
      auml: "\xE4",
      awconint: "\u2233",
      awint: "\u2A11",
      backcong: "\u224C",
      backepsilon: "\u03F6",
      backprime: "\u2035",
      backsim: "\u223D",
      backsimeq: "\u22CD",
      Backslash: "\u2216",
      Barv: "\u2AE7",
      barvee: "\u22BD",
      Barwed: "\u2306",
      barwed: "\u2305",
      barwedge: "\u2305",
      bbrk: "\u23B5",
      bbrktbrk: "\u23B6",
      bcong: "\u224C",
      Bcy: "\u0411",
      bcy: "\u0431",
      bdquo: "\u201E",
      becaus: "\u2235",
      Because: "\u2235",
      because: "\u2235",
      bemptyv: "\u29B0",
      bepsi: "\u03F6",
      bernou: "\u212C",
      Bernoullis: "\u212C",
      Beta: "\u0392",
      beta: "\u03B2",
      beth: "\u2136",
      between: "\u226C",
      Bfr: "\u{1D505}",
      bfr: "\u{1D51F}",
      bigcap: "\u22C2",
      bigcirc: "\u25EF",
      bigcup: "\u22C3",
      bigodot: "\u2A00",
      bigoplus: "\u2A01",
      bigotimes: "\u2A02",
      bigsqcup: "\u2A06",
      bigstar: "\u2605",
      bigtriangledown: "\u25BD",
      bigtriangleup: "\u25B3",
      biguplus: "\u2A04",
      bigvee: "\u22C1",
      bigwedge: "\u22C0",
      bkarow: "\u290D",
      blacklozenge: "\u29EB",
      blacksquare: "\u25AA",
      blacktriangle: "\u25B4",
      blacktriangledown: "\u25BE",
      blacktriangleleft: "\u25C2",
      blacktriangleright: "\u25B8",
      blank: "\u2423",
      blk12: "\u2592",
      blk14: "\u2591",
      blk34: "\u2593",
      block: "\u2588",
      bne: "=\u20E5",
      bnequiv: "\u2261\u20E5",
      bNot: "\u2AED",
      bnot: "\u2310",
      Bopf: "\u{1D539}",
      bopf: "\u{1D553}",
      bot: "\u22A5",
      bottom: "\u22A5",
      bowtie: "\u22C8",
      boxbox: "\u29C9",
      boxDL: "\u2557",
      boxDl: "\u2556",
      boxdL: "\u2555",
      boxdl: "\u2510",
      boxDR: "\u2554",
      boxDr: "\u2553",
      boxdR: "\u2552",
      boxdr: "\u250C",
      boxH: "\u2550",
      boxh: "\u2500",
      boxHD: "\u2566",
      boxHd: "\u2564",
      boxhD: "\u2565",
      boxhd: "\u252C",
      boxHU: "\u2569",
      boxHu: "\u2567",
      boxhU: "\u2568",
      boxhu: "\u2534",
      boxminus: "\u229F",
      boxplus: "\u229E",
      boxtimes: "\u22A0",
      boxUL: "\u255D",
      boxUl: "\u255C",
      boxuL: "\u255B",
      boxul: "\u2518",
      boxUR: "\u255A",
      boxUr: "\u2559",
      boxuR: "\u2558",
      boxur: "\u2514",
      boxV: "\u2551",
      boxv: "\u2502",
      boxVH: "\u256C",
      boxVh: "\u256B",
      boxvH: "\u256A",
      boxvh: "\u253C",
      boxVL: "\u2563",
      boxVl: "\u2562",
      boxvL: "\u2561",
      boxvl: "\u2524",
      boxVR: "\u2560",
      boxVr: "\u255F",
      boxvR: "\u255E",
      boxvr: "\u251C",
      bprime: "\u2035",
      Breve: "\u02D8",
      breve: "\u02D8",
      brvbar: "\xA6",
      Bscr: "\u212C",
      bscr: "\u{1D4B7}",
      bsemi: "\u204F",
      bsim: "\u223D",
      bsime: "\u22CD",
      bsol: "\\",
      bsolb: "\u29C5",
      bsolhsub: "\u27C8",
      bull: "\u2022",
      bullet: "\u2022",
      bump: "\u224E",
      bumpE: "\u2AAE",
      bumpe: "\u224F",
      Bumpeq: "\u224E",
      bumpeq: "\u224F",
      Cacute: "\u0106",
      cacute: "\u0107",
      Cap: "\u22D2",
      cap: "\u2229",
      capand: "\u2A44",
      capbrcup: "\u2A49",
      capcap: "\u2A4B",
      capcup: "\u2A47",
      capdot: "\u2A40",
      CapitalDifferentialD: "\u2145",
      caps: "\u2229\uFE00",
      caret: "\u2041",
      caron: "\u02C7",
      Cayleys: "\u212D",
      ccaps: "\u2A4D",
      Ccaron: "\u010C",
      ccaron: "\u010D",
      Ccedil: "\xC7",
      ccedil: "\xE7",
      Ccirc: "\u0108",
      ccirc: "\u0109",
      Cconint: "\u2230",
      ccups: "\u2A4C",
      ccupssm: "\u2A50",
      Cdot: "\u010A",
      cdot: "\u010B",
      cedil: "\xB8",
      Cedilla: "\xB8",
      cemptyv: "\u29B2",
      cent: "\xA2",
      CenterDot: "\xB7",
      centerdot: "\xB7",
      Cfr: "\u212D",
      cfr: "\u{1D520}",
      CHcy: "\u0427",
      chcy: "\u0447",
      check: "\u2713",
      checkmark: "\u2713",
      Chi: "\u03A7",
      chi: "\u03C7",
      cir: "\u25CB",
      circ: "\u02C6",
      circeq: "\u2257",
      circlearrowleft: "\u21BA",
      circlearrowright: "\u21BB",
      circledast: "\u229B",
      circledcirc: "\u229A",
      circleddash: "\u229D",
      CircleDot: "\u2299",
      circledR: "\xAE",
      circledS: "\u24C8",
      CircleMinus: "\u2296",
      CirclePlus: "\u2295",
      CircleTimes: "\u2297",
      cirE: "\u29C3",
      cire: "\u2257",
      cirfnint: "\u2A10",
      cirmid: "\u2AEF",
      cirscir: "\u29C2",
      ClockwiseContourIntegral: "\u2232",
      CloseCurlyDoubleQuote: "\u201D",
      CloseCurlyQuote: "\u2019",
      clubs: "\u2663",
      clubsuit: "\u2663",
      Colon: "\u2237",
      colon: ":",
      Colone: "\u2A74",
      colone: "\u2254",
      coloneq: "\u2254",
      comma: ",",
      commat: "@",
      comp: "\u2201",
      compfn: "\u2218",
      complement: "\u2201",
      complexes: "\u2102",
      cong: "\u2245",
      congdot: "\u2A6D",
      Congruent: "\u2261",
      Conint: "\u222F",
      conint: "\u222E",
      ContourIntegral: "\u222E",
      Copf: "\u2102",
      copf: "\u{1D554}",
      coprod: "\u2210",
      Coproduct: "\u2210",
      COPY: "\xA9",
      copy: "\xA9",
      copysr: "\u2117",
      CounterClockwiseContourIntegral: "\u2233",
      crarr: "\u21B5",
      Cross: "\u2A2F",
      cross: "\u2717",
      Cscr: "\u{1D49E}",
      cscr: "\u{1D4B8}",
      csub: "\u2ACF",
      csube: "\u2AD1",
      csup: "\u2AD0",
      csupe: "\u2AD2",
      ctdot: "\u22EF",
      cudarrl: "\u2938",
      cudarrr: "\u2935",
      cuepr: "\u22DE",
      cuesc: "\u22DF",
      cularr: "\u21B6",
      cularrp: "\u293D",
      Cup: "\u22D3",
      cup: "\u222A",
      cupbrcap: "\u2A48",
      CupCap: "\u224D",
      cupcap: "\u2A46",
      cupcup: "\u2A4A",
      cupdot: "\u228D",
      cupor: "\u2A45",
      cups: "\u222A\uFE00",
      curarr: "\u21B7",
      curarrm: "\u293C",
      curlyeqprec: "\u22DE",
      curlyeqsucc: "\u22DF",
      curlyvee: "\u22CE",
      curlywedge: "\u22CF",
      curren: "\xA4",
      curvearrowleft: "\u21B6",
      curvearrowright: "\u21B7",
      cuvee: "\u22CE",
      cuwed: "\u22CF",
      cwconint: "\u2232",
      cwint: "\u2231",
      cylcty: "\u232D",
      Dagger: "\u2021",
      dagger: "\u2020",
      daleth: "\u2138",
      Darr: "\u21A1",
      dArr: "\u21D3",
      darr: "\u2193",
      dash: "\u2010",
      Dashv: "\u2AE4",
      dashv: "\u22A3",
      dbkarow: "\u290F",
      dblac: "\u02DD",
      Dcaron: "\u010E",
      dcaron: "\u010F",
      Dcy: "\u0414",
      dcy: "\u0434",
      DD: "\u2145",
      dd: "\u2146",
      ddagger: "\u2021",
      ddarr: "\u21CA",
      DDotrahd: "\u2911",
      ddotseq: "\u2A77",
      deg: "\xB0",
      Del: "\u2207",
      Delta: "\u0394",
      delta: "\u03B4",
      demptyv: "\u29B1",
      dfisht: "\u297F",
      Dfr: "\u{1D507}",
      dfr: "\u{1D521}",
      dHar: "\u2965",
      dharl: "\u21C3",
      dharr: "\u21C2",
      DiacriticalAcute: "\xB4",
      DiacriticalDot: "\u02D9",
      DiacriticalDoubleAcute: "\u02DD",
      DiacriticalGrave: "`",
      DiacriticalTilde: "\u02DC",
      diam: "\u22C4",
      Diamond: "\u22C4",
      diamond: "\u22C4",
      diamondsuit: "\u2666",
      diams: "\u2666",
      die: "\xA8",
      DifferentialD: "\u2146",
      digamma: "\u03DD",
      disin: "\u22F2",
      div: "\xF7",
      divide: "\xF7",
      divideontimes: "\u22C7",
      divonx: "\u22C7",
      DJcy: "\u0402",
      djcy: "\u0452",
      dlcorn: "\u231E",
      dlcrop: "\u230D",
      dollar: "$",
      Dopf: "\u{1D53B}",
      dopf: "\u{1D555}",
      Dot: "\xA8",
      dot: "\u02D9",
      DotDot: "\u20DC",
      doteq: "\u2250",
      doteqdot: "\u2251",
      DotEqual: "\u2250",
      dotminus: "\u2238",
      dotplus: "\u2214",
      dotsquare: "\u22A1",
      doublebarwedge: "\u2306",
      DoubleContourIntegral: "\u222F",
      DoubleDot: "\xA8",
      DoubleDownArrow: "\u21D3",
      DoubleLeftArrow: "\u21D0",
      DoubleLeftRightArrow: "\u21D4",
      DoubleLeftTee: "\u2AE4",
      DoubleLongLeftArrow: "\u27F8",
      DoubleLongLeftRightArrow: "\u27FA",
      DoubleLongRightArrow: "\u27F9",
      DoubleRightArrow: "\u21D2",
      DoubleRightTee: "\u22A8",
      DoubleUpArrow: "\u21D1",
      DoubleUpDownArrow: "\u21D5",
      DoubleVerticalBar: "\u2225",
      DownArrow: "\u2193",
      Downarrow: "\u21D3",
      downarrow: "\u2193",
      DownArrowBar: "\u2913",
      DownArrowUpArrow: "\u21F5",
      DownBreve: "\u0311",
      downdownarrows: "\u21CA",
      downharpoonleft: "\u21C3",
      downharpoonright: "\u21C2",
      DownLeftRightVector: "\u2950",
      DownLeftTeeVector: "\u295E",
      DownLeftVector: "\u21BD",
      DownLeftVectorBar: "\u2956",
      DownRightTeeVector: "\u295F",
      DownRightVector: "\u21C1",
      DownRightVectorBar: "\u2957",
      DownTee: "\u22A4",
      DownTeeArrow: "\u21A7",
      drbkarow: "\u2910",
      drcorn: "\u231F",
      drcrop: "\u230C",
      Dscr: "\u{1D49F}",
      dscr: "\u{1D4B9}",
      DScy: "\u0405",
      dscy: "\u0455",
      dsol: "\u29F6",
      Dstrok: "\u0110",
      dstrok: "\u0111",
      dtdot: "\u22F1",
      dtri: "\u25BF",
      dtrif: "\u25BE",
      duarr: "\u21F5",
      duhar: "\u296F",
      dwangle: "\u29A6",
      DZcy: "\u040F",
      dzcy: "\u045F",
      dzigrarr: "\u27FF",
      Eacute: "\xC9",
      eacute: "\xE9",
      easter: "\u2A6E",
      Ecaron: "\u011A",
      ecaron: "\u011B",
      ecir: "\u2256",
      Ecirc: "\xCA",
      ecirc: "\xEA",
      ecolon: "\u2255",
      Ecy: "\u042D",
      ecy: "\u044D",
      eDDot: "\u2A77",
      Edot: "\u0116",
      eDot: "\u2251",
      edot: "\u0117",
      ee: "\u2147",
      efDot: "\u2252",
      Efr: "\u{1D508}",
      efr: "\u{1D522}",
      eg: "\u2A9A",
      Egrave: "\xC8",
      egrave: "\xE8",
      egs: "\u2A96",
      egsdot: "\u2A98",
      el: "\u2A99",
      Element: "\u2208",
      elinters: "\u23E7",
      ell: "\u2113",
      els: "\u2A95",
      elsdot: "\u2A97",
      Emacr: "\u0112",
      emacr: "\u0113",
      empty: "\u2205",
      emptyset: "\u2205",
      EmptySmallSquare: "\u25FB",
      emptyv: "\u2205",
      EmptyVerySmallSquare: "\u25AB",
      emsp: "\u2003",
      emsp13: "\u2004",
      emsp14: "\u2005",
      ENG: "\u014A",
      eng: "\u014B",
      ensp: "\u2002",
      Eogon: "\u0118",
      eogon: "\u0119",
      Eopf: "\u{1D53C}",
      eopf: "\u{1D556}",
      epar: "\u22D5",
      eparsl: "\u29E3",
      eplus: "\u2A71",
      epsi: "\u03B5",
      Epsilon: "\u0395",
      epsilon: "\u03B5",
      epsiv: "\u03F5",
      eqcirc: "\u2256",
      eqcolon: "\u2255",
      eqsim: "\u2242",
      eqslantgtr: "\u2A96",
      eqslantless: "\u2A95",
      Equal: "\u2A75",
      equals: "=",
      EqualTilde: "\u2242",
      equest: "\u225F",
      Equilibrium: "\u21CC",
      equiv: "\u2261",
      equivDD: "\u2A78",
      eqvparsl: "\u29E5",
      erarr: "\u2971",
      erDot: "\u2253",
      Escr: "\u2130",
      escr: "\u212F",
      esdot: "\u2250",
      Esim: "\u2A73",
      esim: "\u2242",
      Eta: "\u0397",
      eta: "\u03B7",
      ETH: "\xD0",
      eth: "\xF0",
      Euml: "\xCB",
      euml: "\xEB",
      euro: "\u20AC",
      excl: "!",
      exist: "\u2203",
      Exists: "\u2203",
      expectation: "\u2130",
      ExponentialE: "\u2147",
      exponentiale: "\u2147",
      fallingdotseq: "\u2252",
      Fcy: "\u0424",
      fcy: "\u0444",
      female: "\u2640",
      ffilig: "\uFB03",
      fflig: "\uFB00",
      ffllig: "\uFB04",
      Ffr: "\u{1D509}",
      ffr: "\u{1D523}",
      filig: "\uFB01",
      FilledSmallSquare: "\u25FC",
      FilledVerySmallSquare: "\u25AA",
      fjlig: "fj",
      flat: "\u266D",
      fllig: "\uFB02",
      fltns: "\u25B1",
      fnof: "\u0192",
      Fopf: "\u{1D53D}",
      fopf: "\u{1D557}",
      ForAll: "\u2200",
      forall: "\u2200",
      fork: "\u22D4",
      forkv: "\u2AD9",
      Fouriertrf: "\u2131",
      fpartint: "\u2A0D",
      frac12: "\xBD",
      frac13: "\u2153",
      frac14: "\xBC",
      frac15: "\u2155",
      frac16: "\u2159",
      frac18: "\u215B",
      frac23: "\u2154",
      frac25: "\u2156",
      frac34: "\xBE",
      frac35: "\u2157",
      frac38: "\u215C",
      frac45: "\u2158",
      frac56: "\u215A",
      frac58: "\u215D",
      frac78: "\u215E",
      frasl: "\u2044",
      frown: "\u2322",
      Fscr: "\u2131",
      fscr: "\u{1D4BB}",
      gacute: "\u01F5",
      Gamma: "\u0393",
      gamma: "\u03B3",
      Gammad: "\u03DC",
      gammad: "\u03DD",
      gap: "\u2A86",
      Gbreve: "\u011E",
      gbreve: "\u011F",
      Gcedil: "\u0122",
      Gcirc: "\u011C",
      gcirc: "\u011D",
      Gcy: "\u0413",
      gcy: "\u0433",
      Gdot: "\u0120",
      gdot: "\u0121",
      gE: "\u2267",
      ge: "\u2265",
      gEl: "\u2A8C",
      gel: "\u22DB",
      geq: "\u2265",
      geqq: "\u2267",
      geqslant: "\u2A7E",
      ges: "\u2A7E",
      gescc: "\u2AA9",
      gesdot: "\u2A80",
      gesdoto: "\u2A82",
      gesdotol: "\u2A84",
      gesl: "\u22DB\uFE00",
      gesles: "\u2A94",
      Gfr: "\u{1D50A}",
      gfr: "\u{1D524}",
      Gg: "\u22D9",
      gg: "\u226B",
      ggg: "\u22D9",
      gimel: "\u2137",
      GJcy: "\u0403",
      gjcy: "\u0453",
      gl: "\u2277",
      gla: "\u2AA5",
      glE: "\u2A92",
      glj: "\u2AA4",
      gnap: "\u2A8A",
      gnapprox: "\u2A8A",
      gnE: "\u2269",
      gne: "\u2A88",
      gneq: "\u2A88",
      gneqq: "\u2269",
      gnsim: "\u22E7",
      Gopf: "\u{1D53E}",
      gopf: "\u{1D558}",
      grave: "`",
      GreaterEqual: "\u2265",
      GreaterEqualLess: "\u22DB",
      GreaterFullEqual: "\u2267",
      GreaterGreater: "\u2AA2",
      GreaterLess: "\u2277",
      GreaterSlantEqual: "\u2A7E",
      GreaterTilde: "\u2273",
      Gscr: "\u{1D4A2}",
      gscr: "\u210A",
      gsim: "\u2273",
      gsime: "\u2A8E",
      gsiml: "\u2A90",
      Gt: "\u226B",
      GT: ">",
      gt: ">",
      gtcc: "\u2AA7",
      gtcir: "\u2A7A",
      gtdot: "\u22D7",
      gtlPar: "\u2995",
      gtquest: "\u2A7C",
      gtrapprox: "\u2A86",
      gtrarr: "\u2978",
      gtrdot: "\u22D7",
      gtreqless: "\u22DB",
      gtreqqless: "\u2A8C",
      gtrless: "\u2277",
      gtrsim: "\u2273",
      gvertneqq: "\u2269\uFE00",
      gvnE: "\u2269\uFE00",
      Hacek: "\u02C7",
      hairsp: "\u200A",
      half: "\xBD",
      hamilt: "\u210B",
      HARDcy: "\u042A",
      hardcy: "\u044A",
      hArr: "\u21D4",
      harr: "\u2194",
      harrcir: "\u2948",
      harrw: "\u21AD",
      Hat: "^",
      hbar: "\u210F",
      Hcirc: "\u0124",
      hcirc: "\u0125",
      hearts: "\u2665",
      heartsuit: "\u2665",
      hellip: "\u2026",
      hercon: "\u22B9",
      Hfr: "\u210C",
      hfr: "\u{1D525}",
      HilbertSpace: "\u210B",
      hksearow: "\u2925",
      hkswarow: "\u2926",
      hoarr: "\u21FF",
      homtht: "\u223B",
      hookleftarrow: "\u21A9",
      hookrightarrow: "\u21AA",
      Hopf: "\u210D",
      hopf: "\u{1D559}",
      horbar: "\u2015",
      HorizontalLine: "\u2500",
      Hscr: "\u210B",
      hscr: "\u{1D4BD}",
      hslash: "\u210F",
      Hstrok: "\u0126",
      hstrok: "\u0127",
      HumpDownHump: "\u224E",
      HumpEqual: "\u224F",
      hybull: "\u2043",
      hyphen: "\u2010",
      Iacute: "\xCD",
      iacute: "\xED",
      ic: "\u2063",
      Icirc: "\xCE",
      icirc: "\xEE",
      Icy: "\u0418",
      icy: "\u0438",
      Idot: "\u0130",
      IEcy: "\u0415",
      iecy: "\u0435",
      iexcl: "\xA1",
      iff: "\u21D4",
      Ifr: "\u2111",
      ifr: "\u{1D526}",
      Igrave: "\xCC",
      igrave: "\xEC",
      ii: "\u2148",
      iiiint: "\u2A0C",
      iiint: "\u222D",
      iinfin: "\u29DC",
      iiota: "\u2129",
      IJlig: "\u0132",
      ijlig: "\u0133",
      Im: "\u2111",
      Imacr: "\u012A",
      imacr: "\u012B",
      image: "\u2111",
      ImaginaryI: "\u2148",
      imagline: "\u2110",
      imagpart: "\u2111",
      imath: "\u0131",
      imof: "\u22B7",
      imped: "\u01B5",
      Implies: "\u21D2",
      in: "\u2208",
      incare: "\u2105",
      infin: "\u221E",
      infintie: "\u29DD",
      inodot: "\u0131",
      Int: "\u222C",
      int: "\u222B",
      intcal: "\u22BA",
      integers: "\u2124",
      Integral: "\u222B",
      intercal: "\u22BA",
      Intersection: "\u22C2",
      intlarhk: "\u2A17",
      intprod: "\u2A3C",
      InvisibleComma: "\u2063",
      InvisibleTimes: "\u2062",
      IOcy: "\u0401",
      iocy: "\u0451",
      Iogon: "\u012E",
      iogon: "\u012F",
      Iopf: "\u{1D540}",
      iopf: "\u{1D55A}",
      Iota: "\u0399",
      iota: "\u03B9",
      iprod: "\u2A3C",
      iquest: "\xBF",
      Iscr: "\u2110",
      iscr: "\u{1D4BE}",
      isin: "\u2208",
      isindot: "\u22F5",
      isinE: "\u22F9",
      isins: "\u22F4",
      isinsv: "\u22F3",
      isinv: "\u2208",
      it: "\u2062",
      Itilde: "\u0128",
      itilde: "\u0129",
      Iukcy: "\u0406",
      iukcy: "\u0456",
      Iuml: "\xCF",
      iuml: "\xEF",
      Jcirc: "\u0134",
      jcirc: "\u0135",
      Jcy: "\u0419",
      jcy: "\u0439",
      Jfr: "\u{1D50D}",
      jfr: "\u{1D527}",
      jmath: "\u0237",
      Jopf: "\u{1D541}",
      jopf: "\u{1D55B}",
      Jscr: "\u{1D4A5}",
      jscr: "\u{1D4BF}",
      Jsercy: "\u0408",
      jsercy: "\u0458",
      Jukcy: "\u0404",
      jukcy: "\u0454",
      Kappa: "\u039A",
      kappa: "\u03BA",
      kappav: "\u03F0",
      Kcedil: "\u0136",
      kcedil: "\u0137",
      Kcy: "\u041A",
      kcy: "\u043A",
      Kfr: "\u{1D50E}",
      kfr: "\u{1D528}",
      kgreen: "\u0138",
      KHcy: "\u0425",
      khcy: "\u0445",
      KJcy: "\u040C",
      kjcy: "\u045C",
      Kopf: "\u{1D542}",
      kopf: "\u{1D55C}",
      Kscr: "\u{1D4A6}",
      kscr: "\u{1D4C0}",
      lAarr: "\u21DA",
      Lacute: "\u0139",
      lacute: "\u013A",
      laemptyv: "\u29B4",
      lagran: "\u2112",
      Lambda: "\u039B",
      lambda: "\u03BB",
      Lang: "\u27EA",
      lang: "\u27E8",
      langd: "\u2991",
      langle: "\u27E8",
      lap: "\u2A85",
      Laplacetrf: "\u2112",
      laquo: "\xAB",
      Larr: "\u219E",
      lArr: "\u21D0",
      larr: "\u2190",
      larrb: "\u21E4",
      larrbfs: "\u291F",
      larrfs: "\u291D",
      larrhk: "\u21A9",
      larrlp: "\u21AB",
      larrpl: "\u2939",
      larrsim: "\u2973",
      larrtl: "\u21A2",
      lat: "\u2AAB",
      lAtail: "\u291B",
      latail: "\u2919",
      late: "\u2AAD",
      lates: "\u2AAD\uFE00",
      lBarr: "\u290E",
      lbarr: "\u290C",
      lbbrk: "\u2772",
      lbrace: "{",
      lbrack: "[",
      lbrke: "\u298B",
      lbrksld: "\u298F",
      lbrkslu: "\u298D",
      Lcaron: "\u013D",
      lcaron: "\u013E",
      Lcedil: "\u013B",
      lcedil: "\u013C",
      lceil: "\u2308",
      lcub: "{",
      Lcy: "\u041B",
      lcy: "\u043B",
      ldca: "\u2936",
      ldquo: "\u201C",
      ldquor: "\u201E",
      ldrdhar: "\u2967",
      ldrushar: "\u294B",
      ldsh: "\u21B2",
      lE: "\u2266",
      le: "\u2264",
      LeftAngleBracket: "\u27E8",
      LeftArrow: "\u2190",
      Leftarrow: "\u21D0",
      leftarrow: "\u2190",
      LeftArrowBar: "\u21E4",
      LeftArrowRightArrow: "\u21C6",
      leftarrowtail: "\u21A2",
      LeftCeiling: "\u2308",
      LeftDoubleBracket: "\u27E6",
      LeftDownTeeVector: "\u2961",
      LeftDownVector: "\u21C3",
      LeftDownVectorBar: "\u2959",
      LeftFloor: "\u230A",
      leftharpoondown: "\u21BD",
      leftharpoonup: "\u21BC",
      leftleftarrows: "\u21C7",
      LeftRightArrow: "\u2194",
      Leftrightarrow: "\u21D4",
      leftrightarrow: "\u2194",
      leftrightarrows: "\u21C6",
      leftrightharpoons: "\u21CB",
      leftrightsquigarrow: "\u21AD",
      LeftRightVector: "\u294E",
      LeftTee: "\u22A3",
      LeftTeeArrow: "\u21A4",
      LeftTeeVector: "\u295A",
      leftthreetimes: "\u22CB",
      LeftTriangle: "\u22B2",
      LeftTriangleBar: "\u29CF",
      LeftTriangleEqual: "\u22B4",
      LeftUpDownVector: "\u2951",
      LeftUpTeeVector: "\u2960",
      LeftUpVector: "\u21BF",
      LeftUpVectorBar: "\u2958",
      LeftVector: "\u21BC",
      LeftVectorBar: "\u2952",
      lEg: "\u2A8B",
      leg: "\u22DA",
      leq: "\u2264",
      leqq: "\u2266",
      leqslant: "\u2A7D",
      les: "\u2A7D",
      lescc: "\u2AA8",
      lesdot: "\u2A7F",
      lesdoto: "\u2A81",
      lesdotor: "\u2A83",
      lesg: "\u22DA\uFE00",
      lesges: "\u2A93",
      lessapprox: "\u2A85",
      lessdot: "\u22D6",
      lesseqgtr: "\u22DA",
      lesseqqgtr: "\u2A8B",
      LessEqualGreater: "\u22DA",
      LessFullEqual: "\u2266",
      LessGreater: "\u2276",
      lessgtr: "\u2276",
      LessLess: "\u2AA1",
      lesssim: "\u2272",
      LessSlantEqual: "\u2A7D",
      LessTilde: "\u2272",
      lfisht: "\u297C",
      lfloor: "\u230A",
      Lfr: "\u{1D50F}",
      lfr: "\u{1D529}",
      lg: "\u2276",
      lgE: "\u2A91",
      lHar: "\u2962",
      lhard: "\u21BD",
      lharu: "\u21BC",
      lharul: "\u296A",
      lhblk: "\u2584",
      LJcy: "\u0409",
      ljcy: "\u0459",
      Ll: "\u22D8",
      ll: "\u226A",
      llarr: "\u21C7",
      llcorner: "\u231E",
      Lleftarrow: "\u21DA",
      llhard: "\u296B",
      lltri: "\u25FA",
      Lmidot: "\u013F",
      lmidot: "\u0140",
      lmoust: "\u23B0",
      lmoustache: "\u23B0",
      lnap: "\u2A89",
      lnapprox: "\u2A89",
      lnE: "\u2268",
      lne: "\u2A87",
      lneq: "\u2A87",
      lneqq: "\u2268",
      lnsim: "\u22E6",
      loang: "\u27EC",
      loarr: "\u21FD",
      lobrk: "\u27E6",
      LongLeftArrow: "\u27F5",
      Longleftarrow: "\u27F8",
      longleftarrow: "\u27F5",
      LongLeftRightArrow: "\u27F7",
      Longleftrightarrow: "\u27FA",
      longleftrightarrow: "\u27F7",
      longmapsto: "\u27FC",
      LongRightArrow: "\u27F6",
      Longrightarrow: "\u27F9",
      longrightarrow: "\u27F6",
      looparrowleft: "\u21AB",
      looparrowright: "\u21AC",
      lopar: "\u2985",
      Lopf: "\u{1D543}",
      lopf: "\u{1D55D}",
      loplus: "\u2A2D",
      lotimes: "\u2A34",
      lowast: "\u2217",
      lowbar: "_",
      LowerLeftArrow: "\u2199",
      LowerRightArrow: "\u2198",
      loz: "\u25CA",
      lozenge: "\u25CA",
      lozf: "\u29EB",
      lpar: "(",
      lparlt: "\u2993",
      lrarr: "\u21C6",
      lrcorner: "\u231F",
      lrhar: "\u21CB",
      lrhard: "\u296D",
      lrm: "\u200E",
      lrtri: "\u22BF",
      lsaquo: "\u2039",
      Lscr: "\u2112",
      lscr: "\u{1D4C1}",
      Lsh: "\u21B0",
      lsh: "\u21B0",
      lsim: "\u2272",
      lsime: "\u2A8D",
      lsimg: "\u2A8F",
      lsqb: "[",
      lsquo: "\u2018",
      lsquor: "\u201A",
      Lstrok: "\u0141",
      lstrok: "\u0142",
      Lt: "\u226A",
      LT: "<",
      lt: "<",
      ltcc: "\u2AA6",
      ltcir: "\u2A79",
      ltdot: "\u22D6",
      lthree: "\u22CB",
      ltimes: "\u22C9",
      ltlarr: "\u2976",
      ltquest: "\u2A7B",
      ltri: "\u25C3",
      ltrie: "\u22B4",
      ltrif: "\u25C2",
      ltrPar: "\u2996",
      lurdshar: "\u294A",
      luruhar: "\u2966",
      lvertneqq: "\u2268\uFE00",
      lvnE: "\u2268\uFE00",
      macr: "\xAF",
      male: "\u2642",
      malt: "\u2720",
      maltese: "\u2720",
      Map: "\u2905",
      map: "\u21A6",
      mapsto: "\u21A6",
      mapstodown: "\u21A7",
      mapstoleft: "\u21A4",
      mapstoup: "\u21A5",
      marker: "\u25AE",
      mcomma: "\u2A29",
      Mcy: "\u041C",
      mcy: "\u043C",
      mdash: "\u2014",
      mDDot: "\u223A",
      measuredangle: "\u2221",
      MediumSpace: "\u205F",
      Mellintrf: "\u2133",
      Mfr: "\u{1D510}",
      mfr: "\u{1D52A}",
      mho: "\u2127",
      micro: "\xB5",
      mid: "\u2223",
      midast: "*",
      midcir: "\u2AF0",
      middot: "\xB7",
      minus: "\u2212",
      minusb: "\u229F",
      minusd: "\u2238",
      minusdu: "\u2A2A",
      MinusPlus: "\u2213",
      mlcp: "\u2ADB",
      mldr: "\u2026",
      mnplus: "\u2213",
      models: "\u22A7",
      Mopf: "\u{1D544}",
      mopf: "\u{1D55E}",
      mp: "\u2213",
      Mscr: "\u2133",
      mscr: "\u{1D4C2}",
      mstpos: "\u223E",
      Mu: "\u039C",
      mu: "\u03BC",
      multimap: "\u22B8",
      mumap: "\u22B8",
      nabla: "\u2207",
      Nacute: "\u0143",
      nacute: "\u0144",
      nang: "\u2220\u20D2",
      nap: "\u2249",
      napE: "\u2A70\u0338",
      napid: "\u224B\u0338",
      napos: "\u0149",
      napprox: "\u2249",
      natur: "\u266E",
      natural: "\u266E",
      naturals: "\u2115",
      nbsp: "\xA0",
      nbump: "\u224E\u0338",
      nbumpe: "\u224F\u0338",
      ncap: "\u2A43",
      Ncaron: "\u0147",
      ncaron: "\u0148",
      Ncedil: "\u0145",
      ncedil: "\u0146",
      ncong: "\u2247",
      ncongdot: "\u2A6D\u0338",
      ncup: "\u2A42",
      Ncy: "\u041D",
      ncy: "\u043D",
      ndash: "\u2013",
      ne: "\u2260",
      nearhk: "\u2924",
      neArr: "\u21D7",
      nearr: "\u2197",
      nearrow: "\u2197",
      nedot: "\u2250\u0338",
      NegativeMediumSpace: "\u200B",
      NegativeThickSpace: "\u200B",
      NegativeThinSpace: "\u200B",
      NegativeVeryThinSpace: "\u200B",
      nequiv: "\u2262",
      nesear: "\u2928",
      nesim: "\u2242\u0338",
      NestedGreaterGreater: "\u226B",
      NestedLessLess: "\u226A",
      NewLine: "\n",
      nexist: "\u2204",
      nexists: "\u2204",
      Nfr: "\u{1D511}",
      nfr: "\u{1D52B}",
      ngE: "\u2267\u0338",
      nge: "\u2271",
      ngeq: "\u2271",
      ngeqq: "\u2267\u0338",
      ngeqslant: "\u2A7E\u0338",
      nges: "\u2A7E\u0338",
      nGg: "\u22D9\u0338",
      ngsim: "\u2275",
      nGt: "\u226B\u20D2",
      ngt: "\u226F",
      ngtr: "\u226F",
      nGtv: "\u226B\u0338",
      nhArr: "\u21CE",
      nharr: "\u21AE",
      nhpar: "\u2AF2",
      ni: "\u220B",
      nis: "\u22FC",
      nisd: "\u22FA",
      niv: "\u220B",
      NJcy: "\u040A",
      njcy: "\u045A",
      nlArr: "\u21CD",
      nlarr: "\u219A",
      nldr: "\u2025",
      nlE: "\u2266\u0338",
      nle: "\u2270",
      nLeftarrow: "\u21CD",
      nleftarrow: "\u219A",
      nLeftrightarrow: "\u21CE",
      nleftrightarrow: "\u21AE",
      nleq: "\u2270",
      nleqq: "\u2266\u0338",
      nleqslant: "\u2A7D\u0338",
      nles: "\u2A7D\u0338",
      nless: "\u226E",
      nLl: "\u22D8\u0338",
      nlsim: "\u2274",
      nLt: "\u226A\u20D2",
      nlt: "\u226E",
      nltri: "\u22EA",
      nltrie: "\u22EC",
      nLtv: "\u226A\u0338",
      nmid: "\u2224",
      NoBreak: "\u2060",
      NonBreakingSpace: "\xA0",
      Nopf: "\u2115",
      nopf: "\u{1D55F}",
      Not: "\u2AEC",
      not: "\xAC",
      NotCongruent: "\u2262",
      NotCupCap: "\u226D",
      NotDoubleVerticalBar: "\u2226",
      NotElement: "\u2209",
      NotEqual: "\u2260",
      NotEqualTilde: "\u2242\u0338",
      NotExists: "\u2204",
      NotGreater: "\u226F",
      NotGreaterEqual: "\u2271",
      NotGreaterFullEqual: "\u2267\u0338",
      NotGreaterGreater: "\u226B\u0338",
      NotGreaterLess: "\u2279",
      NotGreaterSlantEqual: "\u2A7E\u0338",
      NotGreaterTilde: "\u2275",
      NotHumpDownHump: "\u224E\u0338",
      NotHumpEqual: "\u224F\u0338",
      notin: "\u2209",
      notindot: "\u22F5\u0338",
      notinE: "\u22F9\u0338",
      notinva: "\u2209",
      notinvb: "\u22F7",
      notinvc: "\u22F6",
      NotLeftTriangle: "\u22EA",
      NotLeftTriangleBar: "\u29CF\u0338",
      NotLeftTriangleEqual: "\u22EC",
      NotLess: "\u226E",
      NotLessEqual: "\u2270",
      NotLessGreater: "\u2278",
      NotLessLess: "\u226A\u0338",
      NotLessSlantEqual: "\u2A7D\u0338",
      NotLessTilde: "\u2274",
      NotNestedGreaterGreater: "\u2AA2\u0338",
      NotNestedLessLess: "\u2AA1\u0338",
      notni: "\u220C",
      notniva: "\u220C",
      notnivb: "\u22FE",
      notnivc: "\u22FD",
      NotPrecedes: "\u2280",
      NotPrecedesEqual: "\u2AAF\u0338",
      NotPrecedesSlantEqual: "\u22E0",
      NotReverseElement: "\u220C",
      NotRightTriangle: "\u22EB",
      NotRightTriangleBar: "\u29D0\u0338",
      NotRightTriangleEqual: "\u22ED",
      NotSquareSubset: "\u228F\u0338",
      NotSquareSubsetEqual: "\u22E2",
      NotSquareSuperset: "\u2290\u0338",
      NotSquareSupersetEqual: "\u22E3",
      NotSubset: "\u2282\u20D2",
      NotSubsetEqual: "\u2288",
      NotSucceeds: "\u2281",
      NotSucceedsEqual: "\u2AB0\u0338",
      NotSucceedsSlantEqual: "\u22E1",
      NotSucceedsTilde: "\u227F\u0338",
      NotSuperset: "\u2283\u20D2",
      NotSupersetEqual: "\u2289",
      NotTilde: "\u2241",
      NotTildeEqual: "\u2244",
      NotTildeFullEqual: "\u2247",
      NotTildeTilde: "\u2249",
      NotVerticalBar: "\u2224",
      npar: "\u2226",
      nparallel: "\u2226",
      nparsl: "\u2AFD\u20E5",
      npart: "\u2202\u0338",
      npolint: "\u2A14",
      npr: "\u2280",
      nprcue: "\u22E0",
      npre: "\u2AAF\u0338",
      nprec: "\u2280",
      npreceq: "\u2AAF\u0338",
      nrArr: "\u21CF",
      nrarr: "\u219B",
      nrarrc: "\u2933\u0338",
      nrarrw: "\u219D\u0338",
      nRightarrow: "\u21CF",
      nrightarrow: "\u219B",
      nrtri: "\u22EB",
      nrtrie: "\u22ED",
      nsc: "\u2281",
      nsccue: "\u22E1",
      nsce: "\u2AB0\u0338",
      Nscr: "\u{1D4A9}",
      nscr: "\u{1D4C3}",
      nshortmid: "\u2224",
      nshortparallel: "\u2226",
      nsim: "\u2241",
      nsime: "\u2244",
      nsimeq: "\u2244",
      nsmid: "\u2224",
      nspar: "\u2226",
      nsqsube: "\u22E2",
      nsqsupe: "\u22E3",
      nsub: "\u2284",
      nsubE: "\u2AC5\u0338",
      nsube: "\u2288",
      nsubset: "\u2282\u20D2",
      nsubseteq: "\u2288",
      nsubseteqq: "\u2AC5\u0338",
      nsucc: "\u2281",
      nsucceq: "\u2AB0\u0338",
      nsup: "\u2285",
      nsupE: "\u2AC6\u0338",
      nsupe: "\u2289",
      nsupset: "\u2283\u20D2",
      nsupseteq: "\u2289",
      nsupseteqq: "\u2AC6\u0338",
      ntgl: "\u2279",
      Ntilde: "\xD1",
      ntilde: "\xF1",
      ntlg: "\u2278",
      ntriangleleft: "\u22EA",
      ntrianglelefteq: "\u22EC",
      ntriangleright: "\u22EB",
      ntrianglerighteq: "\u22ED",
      Nu: "\u039D",
      nu: "\u03BD",
      num: "#",
      numero: "\u2116",
      numsp: "\u2007",
      nvap: "\u224D\u20D2",
      nVDash: "\u22AF",
      nVdash: "\u22AE",
      nvDash: "\u22AD",
      nvdash: "\u22AC",
      nvge: "\u2265\u20D2",
      nvgt: ">\u20D2",
      nvHarr: "\u2904",
      nvinfin: "\u29DE",
      nvlArr: "\u2902",
      nvle: "\u2264\u20D2",
      nvlt: "<\u20D2",
      nvltrie: "\u22B4\u20D2",
      nvrArr: "\u2903",
      nvrtrie: "\u22B5\u20D2",
      nvsim: "\u223C\u20D2",
      nwarhk: "\u2923",
      nwArr: "\u21D6",
      nwarr: "\u2196",
      nwarrow: "\u2196",
      nwnear: "\u2927",
      Oacute: "\xD3",
      oacute: "\xF3",
      oast: "\u229B",
      ocir: "\u229A",
      Ocirc: "\xD4",
      ocirc: "\xF4",
      Ocy: "\u041E",
      ocy: "\u043E",
      odash: "\u229D",
      Odblac: "\u0150",
      odblac: "\u0151",
      odiv: "\u2A38",
      odot: "\u2299",
      odsold: "\u29BC",
      OElig: "\u0152",
      oelig: "\u0153",
      ofcir: "\u29BF",
      Ofr: "\u{1D512}",
      ofr: "\u{1D52C}",
      ogon: "\u02DB",
      Ograve: "\xD2",
      ograve: "\xF2",
      ogt: "\u29C1",
      ohbar: "\u29B5",
      ohm: "\u03A9",
      oint: "\u222E",
      olarr: "\u21BA",
      olcir: "\u29BE",
      olcross: "\u29BB",
      oline: "\u203E",
      olt: "\u29C0",
      Omacr: "\u014C",
      omacr: "\u014D",
      Omega: "\u03A9",
      omega: "\u03C9",
      Omicron: "\u039F",
      omicron: "\u03BF",
      omid: "\u29B6",
      ominus: "\u2296",
      Oopf: "\u{1D546}",
      oopf: "\u{1D560}",
      opar: "\u29B7",
      OpenCurlyDoubleQuote: "\u201C",
      OpenCurlyQuote: "\u2018",
      operp: "\u29B9",
      oplus: "\u2295",
      Or: "\u2A54",
      or: "\u2228",
      orarr: "\u21BB",
      ord: "\u2A5D",
      order: "\u2134",
      orderof: "\u2134",
      ordf: "\xAA",
      ordm: "\xBA",
      origof: "\u22B6",
      oror: "\u2A56",
      orslope: "\u2A57",
      orv: "\u2A5B",
      oS: "\u24C8",
      Oscr: "\u{1D4AA}",
      oscr: "\u2134",
      Oslash: "\xD8",
      oslash: "\xF8",
      osol: "\u2298",
      Otilde: "\xD5",
      otilde: "\xF5",
      Otimes: "\u2A37",
      otimes: "\u2297",
      otimesas: "\u2A36",
      Ouml: "\xD6",
      ouml: "\xF6",
      ovbar: "\u233D",
      OverBar: "\u203E",
      OverBrace: "\u23DE",
      OverBracket: "\u23B4",
      OverParenthesis: "\u23DC",
      par: "\u2225",
      para: "\xB6",
      parallel: "\u2225",
      parsim: "\u2AF3",
      parsl: "\u2AFD",
      part: "\u2202",
      PartialD: "\u2202",
      Pcy: "\u041F",
      pcy: "\u043F",
      percnt: "%",
      period: ".",
      permil: "\u2030",
      perp: "\u22A5",
      pertenk: "\u2031",
      Pfr: "\u{1D513}",
      pfr: "\u{1D52D}",
      Phi: "\u03A6",
      phi: "\u03C6",
      phiv: "\u03D5",
      phmmat: "\u2133",
      phone: "\u260E",
      Pi: "\u03A0",
      pi: "\u03C0",
      pitchfork: "\u22D4",
      piv: "\u03D6",
      planck: "\u210F",
      planckh: "\u210E",
      plankv: "\u210F",
      plus: "+",
      plusacir: "\u2A23",
      plusb: "\u229E",
      pluscir: "\u2A22",
      plusdo: "\u2214",
      plusdu: "\u2A25",
      pluse: "\u2A72",
      PlusMinus: "\xB1",
      plusmn: "\xB1",
      plussim: "\u2A26",
      plustwo: "\u2A27",
      pm: "\xB1",
      Poincareplane: "\u210C",
      pointint: "\u2A15",
      Popf: "\u2119",
      popf: "\u{1D561}",
      pound: "\xA3",
      Pr: "\u2ABB",
      pr: "\u227A",
      prap: "\u2AB7",
      prcue: "\u227C",
      prE: "\u2AB3",
      pre: "\u2AAF",
      prec: "\u227A",
      precapprox: "\u2AB7",
      preccurlyeq: "\u227C",
      Precedes: "\u227A",
      PrecedesEqual: "\u2AAF",
      PrecedesSlantEqual: "\u227C",
      PrecedesTilde: "\u227E",
      preceq: "\u2AAF",
      precnapprox: "\u2AB9",
      precneqq: "\u2AB5",
      precnsim: "\u22E8",
      precsim: "\u227E",
      Prime: "\u2033",
      prime: "\u2032",
      primes: "\u2119",
      prnap: "\u2AB9",
      prnE: "\u2AB5",
      prnsim: "\u22E8",
      prod: "\u220F",
      Product: "\u220F",
      profalar: "\u232E",
      profline: "\u2312",
      profsurf: "\u2313",
      prop: "\u221D",
      Proportion: "\u2237",
      Proportional: "\u221D",
      propto: "\u221D",
      prsim: "\u227E",
      prurel: "\u22B0",
      Pscr: "\u{1D4AB}",
      pscr: "\u{1D4C5}",
      Psi: "\u03A8",
      psi: "\u03C8",
      puncsp: "\u2008",
      Qfr: "\u{1D514}",
      qfr: "\u{1D52E}",
      qint: "\u2A0C",
      Qopf: "\u211A",
      qopf: "\u{1D562}",
      qprime: "\u2057",
      Qscr: "\u{1D4AC}",
      qscr: "\u{1D4C6}",
      quaternions: "\u210D",
      quatint: "\u2A16",
      quest: "?",
      questeq: "\u225F",
      QUOT: '"',
      quot: '"',
      rAarr: "\u21DB",
      race: "\u223D\u0331",
      Racute: "\u0154",
      racute: "\u0155",
      radic: "\u221A",
      raemptyv: "\u29B3",
      Rang: "\u27EB",
      rang: "\u27E9",
      rangd: "\u2992",
      range: "\u29A5",
      rangle: "\u27E9",
      raquo: "\xBB",
      Rarr: "\u21A0",
      rArr: "\u21D2",
      rarr: "\u2192",
      rarrap: "\u2975",
      rarrb: "\u21E5",
      rarrbfs: "\u2920",
      rarrc: "\u2933",
      rarrfs: "\u291E",
      rarrhk: "\u21AA",
      rarrlp: "\u21AC",
      rarrpl: "\u2945",
      rarrsim: "\u2974",
      Rarrtl: "\u2916",
      rarrtl: "\u21A3",
      rarrw: "\u219D",
      rAtail: "\u291C",
      ratail: "\u291A",
      ratio: "\u2236",
      rationals: "\u211A",
      RBarr: "\u2910",
      rBarr: "\u290F",
      rbarr: "\u290D",
      rbbrk: "\u2773",
      rbrace: "}",
      rbrack: "]",
      rbrke: "\u298C",
      rbrksld: "\u298E",
      rbrkslu: "\u2990",
      Rcaron: "\u0158",
      rcaron: "\u0159",
      Rcedil: "\u0156",
      rcedil: "\u0157",
      rceil: "\u2309",
      rcub: "}",
      Rcy: "\u0420",
      rcy: "\u0440",
      rdca: "\u2937",
      rdldhar: "\u2969",
      rdquo: "\u201D",
      rdquor: "\u201D",
      rdsh: "\u21B3",
      Re: "\u211C",
      real: "\u211C",
      realine: "\u211B",
      realpart: "\u211C",
      reals: "\u211D",
      rect: "\u25AD",
      REG: "\xAE",
      reg: "\xAE",
      ReverseElement: "\u220B",
      ReverseEquilibrium: "\u21CB",
      ReverseUpEquilibrium: "\u296F",
      rfisht: "\u297D",
      rfloor: "\u230B",
      Rfr: "\u211C",
      rfr: "\u{1D52F}",
      rHar: "\u2964",
      rhard: "\u21C1",
      rharu: "\u21C0",
      rharul: "\u296C",
      Rho: "\u03A1",
      rho: "\u03C1",
      rhov: "\u03F1",
      RightAngleBracket: "\u27E9",
      RightArrow: "\u2192",
      Rightarrow: "\u21D2",
      rightarrow: "\u2192",
      RightArrowBar: "\u21E5",
      RightArrowLeftArrow: "\u21C4",
      rightarrowtail: "\u21A3",
      RightCeiling: "\u2309",
      RightDoubleBracket: "\u27E7",
      RightDownTeeVector: "\u295D",
      RightDownVector: "\u21C2",
      RightDownVectorBar: "\u2955",
      RightFloor: "\u230B",
      rightharpoondown: "\u21C1",
      rightharpoonup: "\u21C0",
      rightleftarrows: "\u21C4",
      rightleftharpoons: "\u21CC",
      rightrightarrows: "\u21C9",
      rightsquigarrow: "\u219D",
      RightTee: "\u22A2",
      RightTeeArrow: "\u21A6",
      RightTeeVector: "\u295B",
      rightthreetimes: "\u22CC",
      RightTriangle: "\u22B3",
      RightTriangleBar: "\u29D0",
      RightTriangleEqual: "\u22B5",
      RightUpDownVector: "\u294F",
      RightUpTeeVector: "\u295C",
      RightUpVector: "\u21BE",
      RightUpVectorBar: "\u2954",
      RightVector: "\u21C0",
      RightVectorBar: "\u2953",
      ring: "\u02DA",
      risingdotseq: "\u2253",
      rlarr: "\u21C4",
      rlhar: "\u21CC",
      rlm: "\u200F",
      rmoust: "\u23B1",
      rmoustache: "\u23B1",
      rnmid: "\u2AEE",
      roang: "\u27ED",
      roarr: "\u21FE",
      robrk: "\u27E7",
      ropar: "\u2986",
      Ropf: "\u211D",
      ropf: "\u{1D563}",
      roplus: "\u2A2E",
      rotimes: "\u2A35",
      RoundImplies: "\u2970",
      rpar: ")",
      rpargt: "\u2994",
      rppolint: "\u2A12",
      rrarr: "\u21C9",
      Rrightarrow: "\u21DB",
      rsaquo: "\u203A",
      Rscr: "\u211B",
      rscr: "\u{1D4C7}",
      Rsh: "\u21B1",
      rsh: "\u21B1",
      rsqb: "]",
      rsquo: "\u2019",
      rsquor: "\u2019",
      rthree: "\u22CC",
      rtimes: "\u22CA",
      rtri: "\u25B9",
      rtrie: "\u22B5",
      rtrif: "\u25B8",
      rtriltri: "\u29CE",
      RuleDelayed: "\u29F4",
      ruluhar: "\u2968",
      rx: "\u211E",
      Sacute: "\u015A",
      sacute: "\u015B",
      sbquo: "\u201A",
      Sc: "\u2ABC",
      sc: "\u227B",
      scap: "\u2AB8",
      Scaron: "\u0160",
      scaron: "\u0161",
      sccue: "\u227D",
      scE: "\u2AB4",
      sce: "\u2AB0",
      Scedil: "\u015E",
      scedil: "\u015F",
      Scirc: "\u015C",
      scirc: "\u015D",
      scnap: "\u2ABA",
      scnE: "\u2AB6",
      scnsim: "\u22E9",
      scpolint: "\u2A13",
      scsim: "\u227F",
      Scy: "\u0421",
      scy: "\u0441",
      sdot: "\u22C5",
      sdotb: "\u22A1",
      sdote: "\u2A66",
      searhk: "\u2925",
      seArr: "\u21D8",
      searr: "\u2198",
      searrow: "\u2198",
      sect: "\xA7",
      semi: ";",
      seswar: "\u2929",
      setminus: "\u2216",
      setmn: "\u2216",
      sext: "\u2736",
      Sfr: "\u{1D516}",
      sfr: "\u{1D530}",
      sfrown: "\u2322",
      sharp: "\u266F",
      SHCHcy: "\u0429",
      shchcy: "\u0449",
      SHcy: "\u0428",
      shcy: "\u0448",
      ShortDownArrow: "\u2193",
      ShortLeftArrow: "\u2190",
      shortmid: "\u2223",
      shortparallel: "\u2225",
      ShortRightArrow: "\u2192",
      ShortUpArrow: "\u2191",
      shy: "\xAD",
      Sigma: "\u03A3",
      sigma: "\u03C3",
      sigmaf: "\u03C2",
      sigmav: "\u03C2",
      sim: "\u223C",
      simdot: "\u2A6A",
      sime: "\u2243",
      simeq: "\u2243",
      simg: "\u2A9E",
      simgE: "\u2AA0",
      siml: "\u2A9D",
      simlE: "\u2A9F",
      simne: "\u2246",
      simplus: "\u2A24",
      simrarr: "\u2972",
      slarr: "\u2190",
      SmallCircle: "\u2218",
      smallsetminus: "\u2216",
      smashp: "\u2A33",
      smeparsl: "\u29E4",
      smid: "\u2223",
      smile: "\u2323",
      smt: "\u2AAA",
      smte: "\u2AAC",
      smtes: "\u2AAC\uFE00",
      SOFTcy: "\u042C",
      softcy: "\u044C",
      sol: "/",
      solb: "\u29C4",
      solbar: "\u233F",
      Sopf: "\u{1D54A}",
      sopf: "\u{1D564}",
      spades: "\u2660",
      spadesuit: "\u2660",
      spar: "\u2225",
      sqcap: "\u2293",
      sqcaps: "\u2293\uFE00",
      sqcup: "\u2294",
      sqcups: "\u2294\uFE00",
      Sqrt: "\u221A",
      sqsub: "\u228F",
      sqsube: "\u2291",
      sqsubset: "\u228F",
      sqsubseteq: "\u2291",
      sqsup: "\u2290",
      sqsupe: "\u2292",
      sqsupset: "\u2290",
      sqsupseteq: "\u2292",
      squ: "\u25A1",
      Square: "\u25A1",
      square: "\u25A1",
      SquareIntersection: "\u2293",
      SquareSubset: "\u228F",
      SquareSubsetEqual: "\u2291",
      SquareSuperset: "\u2290",
      SquareSupersetEqual: "\u2292",
      SquareUnion: "\u2294",
      squarf: "\u25AA",
      squf: "\u25AA",
      srarr: "\u2192",
      Sscr: "\u{1D4AE}",
      sscr: "\u{1D4C8}",
      ssetmn: "\u2216",
      ssmile: "\u2323",
      sstarf: "\u22C6",
      Star: "\u22C6",
      star: "\u2606",
      starf: "\u2605",
      straightepsilon: "\u03F5",
      straightphi: "\u03D5",
      strns: "\xAF",
      Sub: "\u22D0",
      sub: "\u2282",
      subdot: "\u2ABD",
      subE: "\u2AC5",
      sube: "\u2286",
      subedot: "\u2AC3",
      submult: "\u2AC1",
      subnE: "\u2ACB",
      subne: "\u228A",
      subplus: "\u2ABF",
      subrarr: "\u2979",
      Subset: "\u22D0",
      subset: "\u2282",
      subseteq: "\u2286",
      subseteqq: "\u2AC5",
      SubsetEqual: "\u2286",
      subsetneq: "\u228A",
      subsetneqq: "\u2ACB",
      subsim: "\u2AC7",
      subsub: "\u2AD5",
      subsup: "\u2AD3",
      succ: "\u227B",
      succapprox: "\u2AB8",
      succcurlyeq: "\u227D",
      Succeeds: "\u227B",
      SucceedsEqual: "\u2AB0",
      SucceedsSlantEqual: "\u227D",
      SucceedsTilde: "\u227F",
      succeq: "\u2AB0",
      succnapprox: "\u2ABA",
      succneqq: "\u2AB6",
      succnsim: "\u22E9",
      succsim: "\u227F",
      SuchThat: "\u220B",
      Sum: "\u2211",
      sum: "\u2211",
      sung: "\u266A",
      Sup: "\u22D1",
      sup: "\u2283",
      sup1: "\xB9",
      sup2: "\xB2",
      sup3: "\xB3",
      supdot: "\u2ABE",
      supdsub: "\u2AD8",
      supE: "\u2AC6",
      supe: "\u2287",
      supedot: "\u2AC4",
      Superset: "\u2283",
      SupersetEqual: "\u2287",
      suphsol: "\u27C9",
      suphsub: "\u2AD7",
      suplarr: "\u297B",
      supmult: "\u2AC2",
      supnE: "\u2ACC",
      supne: "\u228B",
      supplus: "\u2AC0",
      Supset: "\u22D1",
      supset: "\u2283",
      supseteq: "\u2287",
      supseteqq: "\u2AC6",
      supsetneq: "\u228B",
      supsetneqq: "\u2ACC",
      supsim: "\u2AC8",
      supsub: "\u2AD4",
      supsup: "\u2AD6",
      swarhk: "\u2926",
      swArr: "\u21D9",
      swarr: "\u2199",
      swarrow: "\u2199",
      swnwar: "\u292A",
      szlig: "\xDF",
      Tab: "	",
      target: "\u2316",
      Tau: "\u03A4",
      tau: "\u03C4",
      tbrk: "\u23B4",
      Tcaron: "\u0164",
      tcaron: "\u0165",
      Tcedil: "\u0162",
      tcedil: "\u0163",
      Tcy: "\u0422",
      tcy: "\u0442",
      tdot: "\u20DB",
      telrec: "\u2315",
      Tfr: "\u{1D517}",
      tfr: "\u{1D531}",
      there4: "\u2234",
      Therefore: "\u2234",
      therefore: "\u2234",
      Theta: "\u0398",
      theta: "\u03B8",
      thetasym: "\u03D1",
      thetav: "\u03D1",
      thickapprox: "\u2248",
      thicksim: "\u223C",
      ThickSpace: "\u205F\u200A",
      thinsp: "\u2009",
      ThinSpace: "\u2009",
      thkap: "\u2248",
      thksim: "\u223C",
      THORN: "\xDE",
      thorn: "\xFE",
      Tilde: "\u223C",
      tilde: "\u02DC",
      TildeEqual: "\u2243",
      TildeFullEqual: "\u2245",
      TildeTilde: "\u2248",
      times: "\xD7",
      timesb: "\u22A0",
      timesbar: "\u2A31",
      timesd: "\u2A30",
      tint: "\u222D",
      toea: "\u2928",
      top: "\u22A4",
      topbot: "\u2336",
      topcir: "\u2AF1",
      Topf: "\u{1D54B}",
      topf: "\u{1D565}",
      topfork: "\u2ADA",
      tosa: "\u2929",
      tprime: "\u2034",
      TRADE: "\u2122",
      trade: "\u2122",
      triangle: "\u25B5",
      triangledown: "\u25BF",
      triangleleft: "\u25C3",
      trianglelefteq: "\u22B4",
      triangleq: "\u225C",
      triangleright: "\u25B9",
      trianglerighteq: "\u22B5",
      tridot: "\u25EC",
      trie: "\u225C",
      triminus: "\u2A3A",
      TripleDot: "\u20DB",
      triplus: "\u2A39",
      trisb: "\u29CD",
      tritime: "\u2A3B",
      trpezium: "\u23E2",
      Tscr: "\u{1D4AF}",
      tscr: "\u{1D4C9}",
      TScy: "\u0426",
      tscy: "\u0446",
      TSHcy: "\u040B",
      tshcy: "\u045B",
      Tstrok: "\u0166",
      tstrok: "\u0167",
      twixt: "\u226C",
      twoheadleftarrow: "\u219E",
      twoheadrightarrow: "\u21A0",
      Uacute: "\xDA",
      uacute: "\xFA",
      Uarr: "\u219F",
      uArr: "\u21D1",
      uarr: "\u2191",
      Uarrocir: "\u2949",
      Ubrcy: "\u040E",
      ubrcy: "\u045E",
      Ubreve: "\u016C",
      ubreve: "\u016D",
      Ucirc: "\xDB",
      ucirc: "\xFB",
      Ucy: "\u0423",
      ucy: "\u0443",
      udarr: "\u21C5",
      Udblac: "\u0170",
      udblac: "\u0171",
      udhar: "\u296E",
      ufisht: "\u297E",
      Ufr: "\u{1D518}",
      ufr: "\u{1D532}",
      Ugrave: "\xD9",
      ugrave: "\xF9",
      uHar: "\u2963",
      uharl: "\u21BF",
      uharr: "\u21BE",
      uhblk: "\u2580",
      ulcorn: "\u231C",
      ulcorner: "\u231C",
      ulcrop: "\u230F",
      ultri: "\u25F8",
      Umacr: "\u016A",
      umacr: "\u016B",
      uml: "\xA8",
      UnderBar: "_",
      UnderBrace: "\u23DF",
      UnderBracket: "\u23B5",
      UnderParenthesis: "\u23DD",
      Union: "\u22C3",
      UnionPlus: "\u228E",
      Uogon: "\u0172",
      uogon: "\u0173",
      Uopf: "\u{1D54C}",
      uopf: "\u{1D566}",
      UpArrow: "\u2191",
      Uparrow: "\u21D1",
      uparrow: "\u2191",
      UpArrowBar: "\u2912",
      UpArrowDownArrow: "\u21C5",
      UpDownArrow: "\u2195",
      Updownarrow: "\u21D5",
      updownarrow: "\u2195",
      UpEquilibrium: "\u296E",
      upharpoonleft: "\u21BF",
      upharpoonright: "\u21BE",
      uplus: "\u228E",
      UpperLeftArrow: "\u2196",
      UpperRightArrow: "\u2197",
      Upsi: "\u03D2",
      upsi: "\u03C5",
      upsih: "\u03D2",
      Upsilon: "\u03A5",
      upsilon: "\u03C5",
      UpTee: "\u22A5",
      UpTeeArrow: "\u21A5",
      upuparrows: "\u21C8",
      urcorn: "\u231D",
      urcorner: "\u231D",
      urcrop: "\u230E",
      Uring: "\u016E",
      uring: "\u016F",
      urtri: "\u25F9",
      Uscr: "\u{1D4B0}",
      uscr: "\u{1D4CA}",
      utdot: "\u22F0",
      Utilde: "\u0168",
      utilde: "\u0169",
      utri: "\u25B5",
      utrif: "\u25B4",
      uuarr: "\u21C8",
      Uuml: "\xDC",
      uuml: "\xFC",
      uwangle: "\u29A7",
      vangrt: "\u299C",
      varepsilon: "\u03F5",
      varkappa: "\u03F0",
      varnothing: "\u2205",
      varphi: "\u03D5",
      varpi: "\u03D6",
      varpropto: "\u221D",
      vArr: "\u21D5",
      varr: "\u2195",
      varrho: "\u03F1",
      varsigma: "\u03C2",
      varsubsetneq: "\u228A\uFE00",
      varsubsetneqq: "\u2ACB\uFE00",
      varsupsetneq: "\u228B\uFE00",
      varsupsetneqq: "\u2ACC\uFE00",
      vartheta: "\u03D1",
      vartriangleleft: "\u22B2",
      vartriangleright: "\u22B3",
      Vbar: "\u2AEB",
      vBar: "\u2AE8",
      vBarv: "\u2AE9",
      Vcy: "\u0412",
      vcy: "\u0432",
      VDash: "\u22AB",
      Vdash: "\u22A9",
      vDash: "\u22A8",
      vdash: "\u22A2",
      Vdashl: "\u2AE6",
      Vee: "\u22C1",
      vee: "\u2228",
      veebar: "\u22BB",
      veeeq: "\u225A",
      vellip: "\u22EE",
      Verbar: "\u2016",
      verbar: "|",
      Vert: "\u2016",
      vert: "|",
      VerticalBar: "\u2223",
      VerticalLine: "|",
      VerticalSeparator: "\u2758",
      VerticalTilde: "\u2240",
      VeryThinSpace: "\u200A",
      Vfr: "\u{1D519}",
      vfr: "\u{1D533}",
      vltri: "\u22B2",
      vnsub: "\u2282\u20D2",
      vnsup: "\u2283\u20D2",
      Vopf: "\u{1D54D}",
      vopf: "\u{1D567}",
      vprop: "\u221D",
      vrtri: "\u22B3",
      Vscr: "\u{1D4B1}",
      vscr: "\u{1D4CB}",
      vsubnE: "\u2ACB\uFE00",
      vsubne: "\u228A\uFE00",
      vsupnE: "\u2ACC\uFE00",
      vsupne: "\u228B\uFE00",
      Vvdash: "\u22AA",
      vzigzag: "\u299A",
      Wcirc: "\u0174",
      wcirc: "\u0175",
      wedbar: "\u2A5F",
      Wedge: "\u22C0",
      wedge: "\u2227",
      wedgeq: "\u2259",
      weierp: "\u2118",
      Wfr: "\u{1D51A}",
      wfr: "\u{1D534}",
      Wopf: "\u{1D54E}",
      wopf: "\u{1D568}",
      wp: "\u2118",
      wr: "\u2240",
      wreath: "\u2240",
      Wscr: "\u{1D4B2}",
      wscr: "\u{1D4CC}",
      xcap: "\u22C2",
      xcirc: "\u25EF",
      xcup: "\u22C3",
      xdtri: "\u25BD",
      Xfr: "\u{1D51B}",
      xfr: "\u{1D535}",
      xhArr: "\u27FA",
      xharr: "\u27F7",
      Xi: "\u039E",
      xi: "\u03BE",
      xlArr: "\u27F8",
      xlarr: "\u27F5",
      xmap: "\u27FC",
      xnis: "\u22FB",
      xodot: "\u2A00",
      Xopf: "\u{1D54F}",
      xopf: "\u{1D569}",
      xoplus: "\u2A01",
      xotime: "\u2A02",
      xrArr: "\u27F9",
      xrarr: "\u27F6",
      Xscr: "\u{1D4B3}",
      xscr: "\u{1D4CD}",
      xsqcup: "\u2A06",
      xuplus: "\u2A04",
      xutri: "\u25B3",
      xvee: "\u22C1",
      xwedge: "\u22C0",
      Yacute: "\xDD",
      yacute: "\xFD",
      YAcy: "\u042F",
      yacy: "\u044F",
      Ycirc: "\u0176",
      ycirc: "\u0177",
      Ycy: "\u042B",
      ycy: "\u044B",
      yen: "\xA5",
      Yfr: "\u{1D51C}",
      yfr: "\u{1D536}",
      YIcy: "\u0407",
      yicy: "\u0457",
      Yopf: "\u{1D550}",
      yopf: "\u{1D56A}",
      Yscr: "\u{1D4B4}",
      yscr: "\u{1D4CE}",
      YUcy: "\u042E",
      yucy: "\u044E",
      Yuml: "\u0178",
      yuml: "\xFF",
      Zacute: "\u0179",
      zacute: "\u017A",
      Zcaron: "\u017D",
      zcaron: "\u017E",
      Zcy: "\u0417",
      zcy: "\u0437",
      Zdot: "\u017B",
      zdot: "\u017C",
      zeetrf: "\u2128",
      ZeroWidthSpace: "\u200B",
      Zeta: "\u0396",
      zeta: "\u03B6",
      Zfr: "\u2128",
      zfr: "\u{1D537}",
      ZHcy: "\u0416",
      zhcy: "\u0436",
      zigrarr: "\u21DD",
      Zopf: "\u2124",
      zopf: "\u{1D56B}",
      Zscr: "\u{1D4B5}",
      zscr: "\u{1D4CF}",
      zwj: "\u200D",
      zwnj: "\u200C"
    });
    exports2.entityMap = exports2.HTML_ENTITIES;
  }
});

// node_modules/@xmldom/xmldom/lib/sax.js
var require_sax = __commonJS({
  "node_modules/@xmldom/xmldom/lib/sax.js"(exports2) {
    "use strict";
    var conventions = require_conventions();
    var g = require_grammar();
    var errors = require_errors();
    var isHTMLEscapableRawTextElement = conventions.isHTMLEscapableRawTextElement;
    var isHTMLMimeType = conventions.isHTMLMimeType;
    var isHTMLRawTextElement = conventions.isHTMLRawTextElement;
    var hasOwn = conventions.hasOwn;
    var NAMESPACE = conventions.NAMESPACE;
    var ParseError = errors.ParseError;
    var DOMException = errors.DOMException;
    var S_TAG = 0;
    var S_ATTR = 1;
    var S_ATTR_SPACE = 2;
    var S_EQ = 3;
    var S_ATTR_NOQUOT_VALUE = 4;
    var S_ATTR_END = 5;
    var S_TAG_SPACE = 6;
    var S_TAG_CLOSE = 7;
    function XMLReader() {
    }
    XMLReader.prototype = {
      parse: function(source, defaultNSMap, entityMap) {
        var domBuilder = this.domBuilder;
        domBuilder.startDocument();
        _copy(defaultNSMap, defaultNSMap = /* @__PURE__ */ Object.create(null));
        parse(source, defaultNSMap, entityMap, domBuilder, this.errorHandler);
        domBuilder.endDocument();
      }
    };
    var ENTITY_REG = /&#?\w+;?/g;
    function parse(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
      var isHTML = isHTMLMimeType(domBuilder.mimeType);
      if (source.indexOf(g.UNICODE_REPLACEMENT_CHARACTER) >= 0) {
        errorHandler.warning("Unicode replacement character detected, source encoding issues?");
      }
      function fixedFromCharCode(code) {
        if (code > 65535) {
          code -= 65536;
          var surrogate1 = 55296 + (code >> 10), surrogate2 = 56320 + (code & 1023);
          return String.fromCharCode(surrogate1, surrogate2);
        } else {
          return String.fromCharCode(code);
        }
      }
      function entityReplacer(a2) {
        var complete = a2[a2.length - 1] === ";" ? a2 : a2 + ";";
        if (!isHTML && complete !== a2) {
          errorHandler.error("EntityRef: expecting ;");
          return a2;
        }
        var match = g.Reference.exec(complete);
        if (!match || match[0].length !== complete.length) {
          errorHandler.error("entity not matching Reference production: " + a2);
          return a2;
        }
        var k = complete.slice(1, -1);
        if (hasOwn(entityMap, k)) {
          return entityMap[k];
        } else if (k.charAt(0) === "#") {
          return fixedFromCharCode(parseInt(k.substring(1).replace("x", "0x")));
        } else {
          errorHandler.error("entity not found:" + a2);
          return a2;
        }
      }
      function appendText(end2) {
        if (end2 > start) {
          var xt = source.substring(start, end2).replace(ENTITY_REG, entityReplacer);
          locator && position(start);
          domBuilder.characters(xt, 0, end2 - start);
          start = end2;
        }
      }
      var lineStart = 0;
      var lineEnd = 0;
      var linePattern = /\r\n?|\n|$/g;
      var locator = domBuilder.locator;
      function position(p, m) {
        while (p >= lineEnd && (m = linePattern.exec(source))) {
          lineStart = lineEnd;
          lineEnd = m.index + m[0].length;
          locator.lineNumber++;
        }
        locator.columnNumber = p - lineStart + 1;
      }
      var parseStack = [{ currentNSMap: defaultNSMapCopy }];
      var unclosedTags = [];
      var start = 0;
      while (true) {
        try {
          var tagStart = source.indexOf("<", start);
          if (tagStart < 0) {
            if (!isHTML && unclosedTags.length > 0) {
              return errorHandler.fatalError("unclosed xml tag(s): " + unclosedTags.join(", "));
            }
            if (!source.substring(start).match(/^\s*$/)) {
              var doc = domBuilder.doc;
              var text = doc.createTextNode(source.substring(start));
              if (doc.documentElement) {
                return errorHandler.error("Extra content at the end of the document");
              }
              doc.appendChild(text);
              domBuilder.currentElement = text;
            }
            return;
          }
          if (tagStart > start) {
            var fromSource = source.substring(start, tagStart);
            if (!isHTML && unclosedTags.length === 0) {
              fromSource = fromSource.replace(new RegExp(g.S_OPT.source, "g"), "");
              fromSource && errorHandler.error("Unexpected content outside root element: '" + fromSource + "'");
            }
            appendText(tagStart);
          }
          switch (source.charAt(tagStart + 1)) {
            case "/":
              var end = source.indexOf(">", tagStart + 2);
              var tagNameRaw = source.substring(tagStart + 2, end > 0 ? end : void 0);
              if (!tagNameRaw) {
                return errorHandler.fatalError("end tag name missing");
              }
              var tagNameMatch = end > 0 && g.reg("^", g.QName_group, g.S_OPT, "$").exec(tagNameRaw);
              if (!tagNameMatch) {
                return errorHandler.fatalError('end tag name contains invalid characters: "' + tagNameRaw + '"');
              }
              if (!domBuilder.currentElement && !domBuilder.doc.documentElement) {
                return;
              }
              var currentTagName = unclosedTags[unclosedTags.length - 1] || domBuilder.currentElement.tagName || domBuilder.doc.documentElement.tagName || "";
              if (currentTagName !== tagNameMatch[1]) {
                var tagNameLower = tagNameMatch[1].toLowerCase();
                if (!isHTML || currentTagName.toLowerCase() !== tagNameLower) {
                  return errorHandler.fatalError('Opening and ending tag mismatch: "' + currentTagName + '" != "' + tagNameRaw + '"');
                }
              }
              var config = parseStack.pop();
              unclosedTags.pop();
              var localNSMap = config.localNSMap;
              domBuilder.endElement(config.uri, config.localName, currentTagName);
              if (localNSMap) {
                for (var prefix in localNSMap) {
                  if (hasOwn(localNSMap, prefix)) {
                    domBuilder.endPrefixMapping(prefix);
                  }
                }
              }
              end++;
              break;
            // end element
            case "?":
              locator && position(tagStart);
              end = parseProcessingInstruction(source, tagStart, domBuilder, errorHandler);
              break;
            case "!":
              locator && position(tagStart);
              end = parseDoctypeCommentOrCData(source, tagStart, domBuilder, errorHandler, isHTML);
              break;
            default:
              locator && position(tagStart);
              var el = new ElementAttributes();
              var currentNSMap = parseStack[parseStack.length - 1].currentNSMap;
              var end = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer, errorHandler, isHTML);
              var len = el.length;
              if (!el.closed) {
                if (isHTML && conventions.isHTMLVoidElement(el.tagName)) {
                  el.closed = true;
                } else {
                  unclosedTags.push(el.tagName);
                }
              }
              if (locator && len) {
                var locator2 = copyLocator(locator, {});
                for (var i = 0; i < len; i++) {
                  var a = el[i];
                  position(a.offset);
                  a.locator = copyLocator(locator, {});
                }
                domBuilder.locator = locator2;
                if (appendElement(el, domBuilder, currentNSMap)) {
                  parseStack.push(el);
                }
                domBuilder.locator = locator;
              } else {
                if (appendElement(el, domBuilder, currentNSMap)) {
                  parseStack.push(el);
                }
              }
              if (isHTML && !el.closed) {
                end = parseHtmlSpecialContent(source, end, el.tagName, entityReplacer, domBuilder);
              } else {
                end++;
              }
          }
        } catch (e) {
          if (e instanceof ParseError) {
            throw e;
          } else if (e instanceof DOMException) {
            throw new ParseError(e.name + ": " + e.message, domBuilder.locator, e);
          }
          errorHandler.error("element parse error: " + e);
          end = -1;
        }
        if (end > start) {
          start = end;
        } else {
          appendText(Math.max(tagStart, start) + 1);
        }
      }
    }
    function copyLocator(f, t) {
      t.lineNumber = f.lineNumber;
      t.columnNumber = f.columnNumber;
      return t;
    }
    function parseElementStartPart(source, start, el, currentNSMap, entityReplacer, errorHandler, isHTML) {
      function addAttribute(qname, value2, startIndex) {
        if (hasOwn(el.attributeNames, qname)) {
          return errorHandler.fatalError("Attribute " + qname + " redefined");
        }
        if (!isHTML && value2.indexOf("<") >= 0) {
          return errorHandler.fatalError("Unescaped '<' not allowed in attributes values");
        }
        el.addValue(
          qname,
          // @see https://www.w3.org/TR/xml/#AVNormalize
          // since the xmldom sax parser does not "interpret" DTD the following is not implemented:
          // - recursive replacement of (DTD) entity references
          // - trimming and collapsing multiple spaces into a single one for attributes that are not of type CDATA
          value2.replace(/[\t\n\r]/g, " ").replace(ENTITY_REG, entityReplacer),
          startIndex
        );
      }
      var attrName;
      var value;
      var p = ++start;
      var s = S_TAG;
      while (true) {
        var c = source.charAt(p);
        switch (c) {
          case "=":
            if (s === S_ATTR) {
              attrName = source.slice(start, p);
              s = S_EQ;
            } else if (s === S_ATTR_SPACE) {
              s = S_EQ;
            } else {
              throw new Error("attribute equal must after attrName");
            }
            break;
          case "'":
          case '"':
            if (s === S_EQ || s === S_ATTR) {
              if (s === S_ATTR) {
                errorHandler.warning('attribute value must after "="');
                attrName = source.slice(start, p);
              }
              start = p + 1;
              p = source.indexOf(c, start);
              if (p > 0) {
                value = source.slice(start, p);
                addAttribute(attrName, value, start - 1);
                s = S_ATTR_END;
              } else {
                throw new Error("attribute value no end '" + c + "' match");
              }
            } else if (s == S_ATTR_NOQUOT_VALUE) {
              value = source.slice(start, p);
              addAttribute(attrName, value, start);
              errorHandler.warning('attribute "' + attrName + '" missed start quot(' + c + ")!!");
              start = p + 1;
              s = S_ATTR_END;
            } else {
              throw new Error('attribute value must after "="');
            }
            break;
          case "/":
            switch (s) {
              case S_TAG:
                el.setTagName(source.slice(start, p));
              case S_ATTR_END:
              case S_TAG_SPACE:
              case S_TAG_CLOSE:
                s = S_TAG_CLOSE;
                el.closed = true;
              case S_ATTR_NOQUOT_VALUE:
              case S_ATTR:
                break;
              case S_ATTR_SPACE:
                el.closed = true;
                break;
              //case S_EQ:
              default:
                throw new Error("attribute invalid close char('/')");
            }
            break;
          case "":
            errorHandler.error("unexpected end of input");
            if (s == S_TAG) {
              el.setTagName(source.slice(start, p));
            }
            return p;
          case ">":
            switch (s) {
              case S_TAG:
                el.setTagName(source.slice(start, p));
              case S_ATTR_END:
              case S_TAG_SPACE:
              case S_TAG_CLOSE:
                break;
              //normal
              case S_ATTR_NOQUOT_VALUE:
              //Compatible state
              case S_ATTR:
                value = source.slice(start, p);
                if (value.slice(-1) === "/") {
                  el.closed = true;
                  value = value.slice(0, -1);
                }
              case S_ATTR_SPACE:
                if (s === S_ATTR_SPACE) {
                  value = attrName;
                }
                if (s == S_ATTR_NOQUOT_VALUE) {
                  errorHandler.warning('attribute "' + value + '" missed quot(")!');
                  addAttribute(attrName, value, start);
                } else {
                  if (!isHTML) {
                    errorHandler.warning('attribute "' + value + '" missed value!! "' + value + '" instead!!');
                  }
                  addAttribute(value, value, start);
                }
                break;
              case S_EQ:
                if (!isHTML) {
                  return errorHandler.fatalError(`AttValue: ' or " expected`);
                }
            }
            return p;
          /*xml space '\x20' | #x9 | #xD | #xA; */
          case "\x80":
            c = " ";
          default:
            if (c <= " ") {
              switch (s) {
                case S_TAG:
                  el.setTagName(source.slice(start, p));
                  s = S_TAG_SPACE;
                  break;
                case S_ATTR:
                  attrName = source.slice(start, p);
                  s = S_ATTR_SPACE;
                  break;
                case S_ATTR_NOQUOT_VALUE:
                  var value = source.slice(start, p);
                  errorHandler.warning('attribute "' + value + '" missed quot(")!!');
                  addAttribute(attrName, value, start);
                case S_ATTR_END:
                  s = S_TAG_SPACE;
                  break;
              }
            } else {
              switch (s) {
                //case S_TAG:void();break;
                //case S_ATTR:void();break;
                //case S_ATTR_NOQUOT_VALUE:void();break;
                case S_ATTR_SPACE:
                  if (!isHTML) {
                    errorHandler.warning('attribute "' + attrName + '" missed value!! "' + attrName + '" instead2!!');
                  }
                  addAttribute(attrName, attrName, start);
                  start = p;
                  s = S_ATTR;
                  break;
                case S_ATTR_END:
                  errorHandler.warning('attribute space is required"' + attrName + '"!!');
                case S_TAG_SPACE:
                  s = S_ATTR;
                  start = p;
                  break;
                case S_EQ:
                  s = S_ATTR_NOQUOT_VALUE;
                  start = p;
                  break;
                case S_TAG_CLOSE:
                  throw new Error("elements closed character '/' and '>' must be connected to");
              }
            }
        }
        p++;
      }
    }
    function appendElement(el, domBuilder, currentNSMap) {
      var tagName = el.tagName;
      var localNSMap = null;
      var i = el.length;
      while (i--) {
        var a = el[i];
        var qName = a.qName;
        var value = a.value;
        var nsp = qName.indexOf(":");
        if (nsp > 0) {
          var prefix = a.prefix = qName.slice(0, nsp);
          var localName = qName.slice(nsp + 1);
          var nsPrefix = prefix === "xmlns" && localName;
        } else {
          localName = qName;
          prefix = null;
          nsPrefix = qName === "xmlns" && "";
        }
        a.localName = localName;
        if (nsPrefix !== false) {
          if (localNSMap == null) {
            localNSMap = /* @__PURE__ */ Object.create(null);
            _copy(currentNSMap, currentNSMap = /* @__PURE__ */ Object.create(null));
          }
          currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
          a.uri = NAMESPACE.XMLNS;
          domBuilder.startPrefixMapping(nsPrefix, value);
        }
      }
      var i = el.length;
      while (i--) {
        a = el[i];
        if (a.prefix) {
          if (a.prefix === "xml") {
            a.uri = NAMESPACE.XML;
          }
          if (a.prefix !== "xmlns") {
            a.uri = currentNSMap[a.prefix];
          }
        }
      }
      var nsp = tagName.indexOf(":");
      if (nsp > 0) {
        prefix = el.prefix = tagName.slice(0, nsp);
        localName = el.localName = tagName.slice(nsp + 1);
      } else {
        prefix = null;
        localName = el.localName = tagName;
      }
      var ns = el.uri = currentNSMap[prefix || ""];
      domBuilder.startElement(ns, localName, tagName, el);
      if (el.closed) {
        domBuilder.endElement(ns, localName, tagName);
        if (localNSMap) {
          for (prefix in localNSMap) {
            if (hasOwn(localNSMap, prefix)) {
              domBuilder.endPrefixMapping(prefix);
            }
          }
        }
      } else {
        el.currentNSMap = currentNSMap;
        el.localNSMap = localNSMap;
        return true;
      }
    }
    function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
      var isEscapableRaw = isHTMLEscapableRawTextElement(tagName);
      if (isEscapableRaw || isHTMLRawTextElement(tagName)) {
        var elEndStart = source.indexOf("</" + tagName + ">", elStartEnd);
        var text = source.substring(elStartEnd + 1, elEndStart);
        if (isEscapableRaw) {
          text = text.replace(ENTITY_REG, entityReplacer);
        }
        domBuilder.characters(text, 0, text.length);
        return elEndStart;
      }
      return elStartEnd + 1;
    }
    function _copy(source, target) {
      for (var n in source) {
        if (hasOwn(source, n)) {
          target[n] = source[n];
        }
      }
    }
    function parseUtils(source, start) {
      var index = start;
      function char(n) {
        n = n || 0;
        return source.charAt(index + n);
      }
      function skip(n) {
        n = n || 1;
        index += n;
      }
      function skipBlanks() {
        var blanks = 0;
        while (index < source.length) {
          var c = char();
          if (c !== " " && c !== "\n" && c !== "	" && c !== "\r") {
            return blanks;
          }
          blanks++;
          skip();
        }
        return -1;
      }
      function substringFromIndex() {
        return source.substring(index);
      }
      function substringStartsWith(text) {
        return source.substring(index, index + text.length) === text;
      }
      function substringStartsWithCaseInsensitive(text) {
        return source.substring(index, index + text.length).toUpperCase() === text.toUpperCase();
      }
      function getMatch(args) {
        var expr = g.reg("^", args);
        var match = expr.exec(substringFromIndex());
        if (match) {
          skip(match[0].length);
          return match[0];
        }
        return null;
      }
      return {
        char,
        getIndex: function() {
          return index;
        },
        getMatch,
        getSource: function() {
          return source;
        },
        skip,
        skipBlanks,
        substringFromIndex,
        substringStartsWith,
        substringStartsWithCaseInsensitive
      };
    }
    function parseDoctypeInternalSubset(p, errorHandler) {
      function parsePI(p2, errorHandler2) {
        var match = g.PI.exec(p2.substringFromIndex());
        if (!match) {
          return errorHandler2.fatalError("processing instruction is not well-formed at position " + p2.getIndex());
        }
        if (match[1].toLowerCase() === "xml") {
          return errorHandler2.fatalError(
            "xml declaration is only allowed at the start of the document, but found at position " + p2.getIndex()
          );
        }
        p2.skip(match[0].length);
        return match[0];
      }
      var source = p.getSource();
      if (p.char() === "[") {
        p.skip(1);
        var intSubsetStart = p.getIndex();
        while (p.getIndex() < source.length) {
          p.skipBlanks();
          if (p.char() === "]") {
            var internalSubset = source.substring(intSubsetStart, p.getIndex());
            p.skip(1);
            return internalSubset;
          }
          var current = null;
          if (p.char() === "<" && p.char(1) === "!") {
            switch (p.char(2)) {
              case "E":
                if (p.char(3) === "L") {
                  current = p.getMatch(g.elementdecl);
                } else if (p.char(3) === "N") {
                  current = p.getMatch(g.EntityDecl);
                }
                break;
              case "A":
                current = p.getMatch(g.AttlistDecl);
                break;
              case "N":
                current = p.getMatch(g.NotationDecl);
                break;
              case "-":
                current = p.getMatch(g.Comment);
                break;
            }
          } else if (p.char() === "<" && p.char(1) === "?") {
            current = parsePI(p, errorHandler);
          } else if (p.char() === "%") {
            current = p.getMatch(g.PEReference);
          } else {
            return errorHandler.fatalError("Error detected in Markup declaration");
          }
          if (!current) {
            return errorHandler.fatalError("Error in internal subset at position " + p.getIndex());
          }
        }
        return errorHandler.fatalError("doctype internal subset is not well-formed, missing ]");
      }
    }
    function parseDoctypeCommentOrCData(source, start, domBuilder, errorHandler, isHTML) {
      var p = parseUtils(source, start);
      switch (isHTML ? p.char(2).toUpperCase() : p.char(2)) {
        case "-":
          var comment = p.getMatch(g.Comment);
          if (comment) {
            domBuilder.comment(comment, g.COMMENT_START.length, comment.length - g.COMMENT_START.length - g.COMMENT_END.length);
            return p.getIndex();
          } else {
            return errorHandler.fatalError("comment is not well-formed at position " + p.getIndex());
          }
        case "[":
          var cdata = p.getMatch(g.CDSect);
          if (cdata) {
            if (!isHTML && !domBuilder.currentElement) {
              return errorHandler.fatalError("CDATA outside of element");
            }
            domBuilder.startCDATA();
            domBuilder.characters(cdata, g.CDATA_START.length, cdata.length - g.CDATA_START.length - g.CDATA_END.length);
            domBuilder.endCDATA();
            return p.getIndex();
          } else {
            return errorHandler.fatalError("Invalid CDATA starting at position " + start);
          }
        case "D": {
          if (domBuilder.doc && domBuilder.doc.documentElement) {
            return errorHandler.fatalError("Doctype not allowed inside or after documentElement at position " + p.getIndex());
          }
          if (isHTML ? !p.substringStartsWithCaseInsensitive(g.DOCTYPE_DECL_START) : !p.substringStartsWith(g.DOCTYPE_DECL_START)) {
            return errorHandler.fatalError("Expected " + g.DOCTYPE_DECL_START + " at position " + p.getIndex());
          }
          p.skip(g.DOCTYPE_DECL_START.length);
          if (p.skipBlanks() < 1) {
            return errorHandler.fatalError("Expected whitespace after " + g.DOCTYPE_DECL_START + " at position " + p.getIndex());
          }
          var doctype = {
            name: void 0,
            publicId: void 0,
            systemId: void 0,
            internalSubset: void 0
          };
          doctype.name = p.getMatch(g.Name);
          if (!doctype.name)
            return errorHandler.fatalError("doctype name missing or contains unexpected characters at position " + p.getIndex());
          if (isHTML && doctype.name.toLowerCase() !== "html") {
            errorHandler.warning("Unexpected DOCTYPE in HTML document at position " + p.getIndex());
          }
          p.skipBlanks();
          if (p.substringStartsWith(g.PUBLIC) || p.substringStartsWith(g.SYSTEM)) {
            var match = g.ExternalID_match.exec(p.substringFromIndex());
            if (!match) {
              return errorHandler.fatalError("doctype external id is not well-formed at position " + p.getIndex());
            }
            if (match.groups.SystemLiteralOnly !== void 0) {
              doctype.systemId = match.groups.SystemLiteralOnly;
            } else {
              doctype.systemId = match.groups.SystemLiteral;
              doctype.publicId = match.groups.PubidLiteral;
            }
            p.skip(match[0].length);
          } else if (isHTML && p.substringStartsWithCaseInsensitive(g.SYSTEM)) {
            p.skip(g.SYSTEM.length);
            if (p.skipBlanks() < 1) {
              return errorHandler.fatalError("Expected whitespace after " + g.SYSTEM + " at position " + p.getIndex());
            }
            doctype.systemId = p.getMatch(g.ABOUT_LEGACY_COMPAT_SystemLiteral);
            if (!doctype.systemId) {
              return errorHandler.fatalError(
                "Expected " + g.ABOUT_LEGACY_COMPAT + " in single or double quotes after " + g.SYSTEM + " at position " + p.getIndex()
              );
            }
          }
          if (isHTML && doctype.systemId && !g.ABOUT_LEGACY_COMPAT_SystemLiteral.test(doctype.systemId)) {
            errorHandler.warning("Unexpected doctype.systemId in HTML document at position " + p.getIndex());
          }
          if (!isHTML) {
            p.skipBlanks();
            doctype.internalSubset = parseDoctypeInternalSubset(p, errorHandler);
          }
          p.skipBlanks();
          if (p.char() !== ">") {
            return errorHandler.fatalError("doctype not terminated with > at position " + p.getIndex());
          }
          p.skip(1);
          domBuilder.startDTD(doctype.name, doctype.publicId, doctype.systemId, doctype.internalSubset);
          domBuilder.endDTD();
          return p.getIndex();
        }
        default:
          return errorHandler.fatalError('Not well-formed XML starting with "<!" at position ' + start);
      }
    }
    function parseProcessingInstruction(source, start, domBuilder, errorHandler) {
      var match = source.substring(start).match(g.PI);
      if (!match) {
        return errorHandler.fatalError("Invalid processing instruction starting at position " + start);
      }
      if (match[1].toLowerCase() === "xml") {
        if (start > 0) {
          return errorHandler.fatalError(
            "processing instruction at position " + start + " is an xml declaration which is only at the start of the document"
          );
        }
        if (!g.XMLDecl.test(source.substring(start))) {
          return errorHandler.fatalError("xml declaration is not well-formed");
        }
      }
      domBuilder.processingInstruction(match[1], match[2]);
      return start + match[0].length;
    }
    function ElementAttributes() {
      this.attributeNames = /* @__PURE__ */ Object.create(null);
    }
    ElementAttributes.prototype = {
      setTagName: function(tagName) {
        if (!g.QName_exact.test(tagName)) {
          throw new Error("invalid tagName:" + tagName);
        }
        this.tagName = tagName;
      },
      addValue: function(qName, value, offset) {
        if (!g.QName_exact.test(qName)) {
          throw new Error("invalid attribute:" + qName);
        }
        this.attributeNames[qName] = this.length;
        this[this.length++] = { qName, value, offset };
      },
      length: 0,
      getLocalName: function(i) {
        return this[i].localName;
      },
      getLocator: function(i) {
        return this[i].locator;
      },
      getQName: function(i) {
        return this[i].qName;
      },
      getURI: function(i) {
        return this[i].uri;
      },
      getValue: function(i) {
        return this[i].value;
      }
      //	,getIndex:function(uri, localName)){
      //		if(localName){
      //
      //		}else{
      //			var qName = uri
      //		}
      //	},
      //	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
      //	getType:function(uri,localName){}
      //	getType:function(i){},
    };
    exports2.XMLReader = XMLReader;
    exports2.parseUtils = parseUtils;
    exports2.parseDoctypeCommentOrCData = parseDoctypeCommentOrCData;
  }
});

// node_modules/@xmldom/xmldom/lib/dom-parser.js
var require_dom_parser = __commonJS({
  "node_modules/@xmldom/xmldom/lib/dom-parser.js"(exports2) {
    "use strict";
    var conventions = require_conventions();
    var dom = require_dom();
    var errors = require_errors();
    var entities = require_entities();
    var sax = require_sax();
    var DOMImplementation = dom.DOMImplementation;
    var hasDefaultHTMLNamespace = conventions.hasDefaultHTMLNamespace;
    var isHTMLMimeType = conventions.isHTMLMimeType;
    var isValidMimeType = conventions.isValidMimeType;
    var MIME_TYPE = conventions.MIME_TYPE;
    var NAMESPACE = conventions.NAMESPACE;
    var ParseError = errors.ParseError;
    var XMLReader = sax.XMLReader;
    function normalizeLineEndings(input) {
      return input.replace(/\r[\n\u0085]/g, "\n").replace(/[\r\u0085\u2028\u2029]/g, "\n");
    }
    function DOMParser2(options) {
      options = options || {};
      if (options.locator === void 0) {
        options.locator = true;
      }
      this.assign = options.assign || conventions.assign;
      this.domHandler = options.domHandler || DOMHandler;
      this.onError = options.onError || options.errorHandler;
      if (options.errorHandler && typeof options.errorHandler !== "function") {
        throw new TypeError("errorHandler object is no longer supported, switch to onError!");
      } else if (options.errorHandler) {
        options.errorHandler("warning", "The `errorHandler` option has been deprecated, use `onError` instead!", this);
      }
      this.normalizeLineEndings = options.normalizeLineEndings || normalizeLineEndings;
      this.locator = !!options.locator;
      this.xmlns = this.assign(/* @__PURE__ */ Object.create(null), options.xmlns);
    }
    DOMParser2.prototype.parseFromString = function(source, mimeType) {
      if (!isValidMimeType(mimeType)) {
        throw new TypeError('DOMParser.parseFromString: the provided mimeType "' + mimeType + '" is not valid.');
      }
      var defaultNSMap = this.assign(/* @__PURE__ */ Object.create(null), this.xmlns);
      var entityMap = entities.XML_ENTITIES;
      var defaultNamespace = defaultNSMap[""] || null;
      if (hasDefaultHTMLNamespace(mimeType)) {
        entityMap = entities.HTML_ENTITIES;
        defaultNamespace = NAMESPACE.HTML;
      } else if (mimeType === MIME_TYPE.XML_SVG_IMAGE) {
        defaultNamespace = NAMESPACE.SVG;
      }
      defaultNSMap[""] = defaultNamespace;
      defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML;
      var domBuilder = new this.domHandler({
        mimeType,
        defaultNamespace,
        onError: this.onError
      });
      var locator = this.locator ? {} : void 0;
      if (this.locator) {
        domBuilder.setDocumentLocator(locator);
      }
      var sax2 = new XMLReader();
      sax2.errorHandler = domBuilder;
      sax2.domBuilder = domBuilder;
      var isXml = !conventions.isHTMLMimeType(mimeType);
      if (isXml && typeof source !== "string") {
        sax2.errorHandler.fatalError("source is not a string");
      }
      sax2.parse(this.normalizeLineEndings(String(source)), defaultNSMap, entityMap);
      if (!domBuilder.doc.documentElement) {
        sax2.errorHandler.fatalError("missing root element");
      }
      return domBuilder.doc;
    };
    function DOMHandler(options) {
      var opt = options || {};
      this.mimeType = opt.mimeType || MIME_TYPE.XML_APPLICATION;
      this.defaultNamespace = opt.defaultNamespace || null;
      this.cdata = false;
      this.currentElement = void 0;
      this.doc = void 0;
      this.locator = void 0;
      this.onError = opt.onError;
    }
    function position(locator, node) {
      node.lineNumber = locator.lineNumber;
      node.columnNumber = locator.columnNumber;
    }
    DOMHandler.prototype = {
      /**
       * Either creates an XML or an HTML document and stores it under `this.doc`.
       * If it is an XML document, `this.defaultNamespace` is used to create it,
       * and it will not contain any `childNodes`.
       * If it is an HTML document, it will be created without any `childNodes`.
       *
       * @see http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
       */
      startDocument: function() {
        var impl = new DOMImplementation();
        this.doc = isHTMLMimeType(this.mimeType) ? impl.createHTMLDocument(false) : impl.createDocument(this.defaultNamespace, "");
      },
      startElement: function(namespaceURI, localName, qName, attrs) {
        var doc = this.doc;
        var el = doc.createElementNS(namespaceURI, qName || localName);
        var len = attrs.length;
        appendElement(this, el);
        this.currentElement = el;
        this.locator && position(this.locator, el);
        for (var i = 0; i < len; i++) {
          var namespaceURI = attrs.getURI(i);
          var value = attrs.getValue(i);
          var qName = attrs.getQName(i);
          var attr = doc.createAttributeNS(namespaceURI, qName);
          this.locator && position(attrs.getLocator(i), attr);
          attr.value = attr.nodeValue = value;
          el.setAttributeNode(attr);
        }
      },
      endElement: function(namespaceURI, localName, qName) {
        this.currentElement = this.currentElement.parentNode;
      },
      startPrefixMapping: function(prefix, uri) {
      },
      endPrefixMapping: function(prefix) {
      },
      processingInstruction: function(target, data) {
        var ins = this.doc.createProcessingInstruction(target, data);
        this.locator && position(this.locator, ins);
        appendElement(this, ins);
      },
      ignorableWhitespace: function(ch, start, length) {
      },
      characters: function(chars, start, length) {
        chars = _toString.apply(this, arguments);
        if (chars) {
          if (this.cdata) {
            var charNode = this.doc.createCDATASection(chars);
          } else {
            var charNode = this.doc.createTextNode(chars);
          }
          if (this.currentElement) {
            this.currentElement.appendChild(charNode);
          } else if (/^\s*$/.test(chars)) {
            this.doc.appendChild(charNode);
          }
          this.locator && position(this.locator, charNode);
        }
      },
      skippedEntity: function(name) {
      },
      endDocument: function() {
        this.doc.normalize();
      },
      /**
       * Stores the locator to be able to set the `columnNumber` and `lineNumber`
       * on the created DOM nodes.
       *
       * @param {Locator} locator
       */
      setDocumentLocator: function(locator) {
        if (locator) {
          locator.lineNumber = 0;
        }
        this.locator = locator;
      },
      //LexicalHandler
      comment: function(chars, start, length) {
        chars = _toString.apply(this, arguments);
        var comm = this.doc.createComment(chars);
        this.locator && position(this.locator, comm);
        appendElement(this, comm);
      },
      startCDATA: function() {
        this.cdata = true;
      },
      endCDATA: function() {
        this.cdata = false;
      },
      startDTD: function(name, publicId, systemId, internalSubset) {
        var impl = this.doc.implementation;
        if (impl && impl.createDocumentType) {
          var dt = impl.createDocumentType(name, publicId, systemId, internalSubset);
          this.locator && position(this.locator, dt);
          appendElement(this, dt);
          this.doc.doctype = dt;
        }
      },
      reportError: function(level, message) {
        if (typeof this.onError === "function") {
          try {
            this.onError(level, message, this);
          } catch (e) {
            throw new ParseError("Reporting " + level + ' "' + message + '" caused ' + e, this.locator);
          }
        } else {
          console.error("[xmldom " + level + "]	" + message, _locator(this.locator));
        }
      },
      /**
       * @see http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
       */
      warning: function(message) {
        this.reportError("warning", message);
      },
      error: function(message) {
        this.reportError("error", message);
      },
      /**
       * This function reports a fatal error and throws a ParseError.
       *
       * @param {string} message
       * - The message to be used for reporting and throwing the error.
       * @returns {never}
       * This function always throws an error and never returns a value.
       * @throws {ParseError}
       * Always throws a ParseError with the provided message.
       */
      fatalError: function(message) {
        this.reportError("fatalError", message);
        throw new ParseError(message, this.locator);
      }
    };
    function _locator(l) {
      if (l) {
        return "\n@#[line:" + l.lineNumber + ",col:" + l.columnNumber + "]";
      }
    }
    function _toString(chars, start, length) {
      if (typeof chars == "string") {
        return chars.substr(start, length);
      } else {
        if (chars.length >= start + length || start) {
          return new java.lang.String(chars, start, length) + "";
        }
        return chars;
      }
    }
    "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(
      /\w+/g,
      function(key) {
        DOMHandler.prototype[key] = function() {
          return null;
        };
      }
    );
    function appendElement(handler, node) {
      if (!handler.currentElement) {
        handler.doc.appendChild(node);
      } else {
        handler.currentElement.appendChild(node);
      }
    }
    function onErrorStopParsing(level) {
      if (level === "error") throw "onErrorStopParsing";
    }
    function onWarningStopParsing() {
      throw "onWarningStopParsing";
    }
    exports2.__DOMHandler = DOMHandler;
    exports2.DOMParser = DOMParser2;
    exports2.normalizeLineEndings = normalizeLineEndings;
    exports2.onErrorStopParsing = onErrorStopParsing;
    exports2.onWarningStopParsing = onWarningStopParsing;
  }
});

// node_modules/@xmldom/xmldom/lib/index.js
var require_lib = __commonJS({
  "node_modules/@xmldom/xmldom/lib/index.js"(exports2) {
    "use strict";
    var conventions = require_conventions();
    exports2.assign = conventions.assign;
    exports2.hasDefaultHTMLNamespace = conventions.hasDefaultHTMLNamespace;
    exports2.isHTMLMimeType = conventions.isHTMLMimeType;
    exports2.isValidMimeType = conventions.isValidMimeType;
    exports2.MIME_TYPE = conventions.MIME_TYPE;
    exports2.NAMESPACE = conventions.NAMESPACE;
    var errors = require_errors();
    exports2.DOMException = errors.DOMException;
    exports2.DOMExceptionName = errors.DOMExceptionName;
    exports2.ExceptionCode = errors.ExceptionCode;
    exports2.ParseError = errors.ParseError;
    var dom = require_dom();
    exports2.Attr = dom.Attr;
    exports2.CDATASection = dom.CDATASection;
    exports2.CharacterData = dom.CharacterData;
    exports2.Comment = dom.Comment;
    exports2.Document = dom.Document;
    exports2.DocumentFragment = dom.DocumentFragment;
    exports2.DocumentType = dom.DocumentType;
    exports2.DOMImplementation = dom.DOMImplementation;
    exports2.Element = dom.Element;
    exports2.Entity = dom.Entity;
    exports2.EntityReference = dom.EntityReference;
    exports2.LiveNodeList = dom.LiveNodeList;
    exports2.NamedNodeMap = dom.NamedNodeMap;
    exports2.Node = dom.Node;
    exports2.NodeList = dom.NodeList;
    exports2.Notation = dom.Notation;
    exports2.ProcessingInstruction = dom.ProcessingInstruction;
    exports2.Text = dom.Text;
    exports2.XMLSerializer = dom.XMLSerializer;
    var domParser = require_dom_parser();
    exports2.DOMParser = domParser.DOMParser;
    exports2.normalizeLineEndings = domParser.normalizeLineEndings;
    exports2.onErrorStopParsing = domParser.onErrorStopParsing;
    exports2.onWarningStopParsing = domParser.onWarningStopParsing;
  }
});

// node_modules/exifreader/dist/exif-reader.js
var require_exif_reader = __commonJS({
  "node_modules/exifreader/dist/exif-reader.js"(exports2, module2) {
    !function(e, t) {
      "object" == typeof exports2 && "object" == typeof module2 ? module2.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports2 ? exports2.ExifReader = t() : e.ExifReader = t();
    }("undefined" != typeof self ? self : exports2, function() {
      return function() {
        "use strict";
        var e = { d: function(t2, n2) {
          for (var r2 in n2) e.o(n2, r2) && !e.o(t2, r2) && Object.defineProperty(t2, r2, { enumerable: 1, get: n2[r2] });
        }, o: function(e2, t2) {
          return Object.prototype.hasOwnProperty.call(e2, t2);
        }, r: function(e2) {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: 1 });
        } }, t = {};
        function n(e2) {
          return n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e3) {
            return typeof e3;
          } : function(e3) {
            return e3 && "function" == typeof Symbol && e3.constructor === Symbol && e3 !== Symbol.prototype ? "symbol" : typeof e3;
          }, n(e2);
        }
        function r(e2) {
          var t2 = function(e3) {
            if ("object" != n(e3) || !e3) return e3;
            var t3 = e3[Symbol.toPrimitive];
            if (void 0 !== t3) {
              var r2 = t3.call(e3, "string");
              if ("object" != n(r2)) return r2;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return e3 + "";
          }(e2);
          return "symbol" == n(t2) ? t2 : t2 + "";
        }
        e.r(t), e.d(t, { default: function() {
          return Li;
        }, errors: function() {
          return _i;
        }, load: function() {
          return Bi;
        }, loadView: function() {
          return ji;
        } });
        var i = function() {
          return e2 = function e3(t3) {
            if (function(e4, t4) {
              if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            }(this, e3), function(e4) {
              return "object" !== n(e4) || void 0 === e4.length || void 0 === e4.readUInt8 || void 0 === e4.readUInt16LE || void 0 === e4.readUInt16BE || void 0 === e4.readUInt32LE || void 0 === e4.readUInt32BE || void 0 === e4.readInt32LE || void 0 === e4.readInt32BE;
            }(t3)) throw Error("DataView: Passed buffer type is unsupported.");
            this.buffer = t3, this.byteLength = this.buffer.length;
          }, (t2 = [{ key: "getUint8", value: function(e3) {
            return this.buffer.readUInt8(e3);
          } }, { key: "getUint16", value: function(e3, t3) {
            return t3 ? this.buffer.readUInt16LE(e3) : this.buffer.readUInt16BE(e3);
          } }, { key: "getUint32", value: function(e3, t3) {
            return t3 ? this.buffer.readUInt32LE(e3) : this.buffer.readUInt32BE(e3);
          } }, { key: "getInt32", value: function(e3, t3) {
            return t3 ? this.buffer.readInt32LE(e3) : this.buffer.readInt32BE(e3);
          } }]) && function(e3, t3) {
            for (var n2 = 0; n2 < t3.length; n2++) {
              var i2 = t3[n2];
              i2.enumerable = i2.enumerable || 0, i2.configurable = 1, "value" in i2 && (i2.writable = 1), Object.defineProperty(e3, r(i2.key), i2);
            }
          }(e2.prototype, t2), Object.defineProperty(e2, "prototype", { writable: 0 }), e2;
          var e2, t2;
        }();
        function o(e2, t2, n2) {
          try {
            return new DataView(e2, t2, n2);
          } catch (r2) {
            return new i(e2, t2, n2);
          }
        }
        function a(e2, t2, n2) {
          for (var r2 = [], i2 = 0; i2 < n2 && t2 + i2 < e2.byteLength; i2++) r2.push(e2.getUint8(t2 + i2));
          return s(r2);
        }
        function u(e2, t2) {
          for (var n2 = [], r2 = 0; t2 + r2 < e2.byteLength; ) {
            var i2 = e2.getUint8(t2 + r2);
            if (0 === i2) break;
            n2.push(i2), r2++;
          }
          return s(n2);
        }
        function c(e2, t2, n2) {
          for (var r2 = [], i2 = 0; i2 < n2 && t2 + i2 < e2.byteLength; i2 += 2) r2.push(e2.getUint16(t2 + i2));
          return 0 === r2[r2.length - 1] && r2.pop(), s(r2);
        }
        function f(e2, t2) {
          var n2 = e2.getUint8(t2);
          return [n2, a(e2, t2 + 1, n2)];
        }
        function s(e2) {
          return e2.map(function(e3) {
            return String.fromCharCode(e3);
          }).join("");
        }
        function l() {
          for (var e2 = 1; e2 < arguments.length; e2++) for (var t2 in arguments[e2]) arguments[0][t2] = arguments[e2][t2];
          return arguments[0];
        }
        function d(e2, t2, n2) {
          var r2 = 0;
          Object.defineProperty(e2, t2, { get: function() {
            return r2 || (r2 = 1, Object.defineProperty(e2, t2, { configurable: 1, enumerable: 1, value: n2.apply(e2), writable: 1 })), e2[t2];
          }, configurable: 1, enumerable: 1 });
        }
        function p(e2) {
          return "undefined" != typeof btoa ? "string" == typeof e2 ? btoa(e2) : btoa(Array.prototype.reduce.call(new Uint8Array(e2), function(e3, t2) {
            return e3 + String.fromCharCode(t2);
          }, "")) : "undefined" != typeof Buffer ? "undefined" != typeof Buffer.from ? Buffer.from(e2).toString("base64") : new Buffer(e2).toString("base64") : void 0;
        }
        function m(e2, t2) {
          return Array(t2 + 1).join(e2);
        }
        var g = void 0;
        function v(e2, t2, n2) {
          var r2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "string";
          if (0 === t2 && "function" == typeof DecompressionStream) {
            var i2 = new DecompressionStream("deflate"), o2 = new Blob([e2]).stream().pipeThrough(i2);
            return "dataview" === r2 ? new Response(o2).arrayBuffer().then(function(e3) {
              return new DataView(e3);
            }) : new Response(o2).arrayBuffer().then(function(e3) {
              return new TextDecoder(n2).decode(e3);
            });
          }
          return void 0 !== t2 ? Promise.reject("Unknown compression method ".concat(t2, ".")) : e2;
        }
        var h = { USE_FILE: 1, USE_JFIF: 1, USE_PNG_FILE: 1, USE_EXIF: 1, USE_IPTC: 1, USE_XMP: 1, USE_ICC: 1, USE_MPF: 1, USE_PHOTOSHOP: 1, USE_THUMBNAIL: 1, USE_TIFF: 1, USE_JPEG: 1, USE_PNG: 1, USE_HEIC: 1, USE_AVIF: 1, USE_WEBP: 1, USE_GIF: 1, USE_MAKER_NOTES: 1 };
        function y(e2) {
          return e2.map(function(e3) {
            return String.fromCharCode(e3);
          }).join("");
        }
        function S(e2) {
          if (e2.length >= 8) {
            var t2 = y(e2.slice(0, 8));
            if ("ASCII\0\0\0" === t2) return y(e2.slice(8));
            if ("JIS\0\0\0\0\0" === t2) return "[JIS encoded text]";
            if ("UNICODE\0" === t2) return "[Unicode encoded text]";
            if ("\0\0\0\0\0\0\0\0" === t2) return "[Undefined encoding]";
          }
          return "Undefined";
        }
        function b(e2) {
          return e2[0][0] / e2[0][1] + e2[1][0] / e2[1][1] / 60 + e2[2][0] / e2[2][1] / 3600;
        }
        var I = 18761, C = I, U = function(e2, t2) {
          if (e2.getUint16(t2) === I) return I;
          if (19789 === e2.getUint16(t2)) return 19789;
          throw Error("Illegal byte order value. Faulty image.");
        }, P = 2, A = 65496, E = 2, w = 4, x = 2, T = 2, O = 10, M = 18, F = 33, R = 79, k = 18, D = 8, N = "ICC_PROFILE\0", L = w + N.length, _ = L + 1, B = "MPF\0", G = 65472, j = 65474, z = 65476, V = 65499, H = 65501, W = 65498, X = 65504, J = 65505, Y = 65506, K = 65517, q = 65519, $ = 65534, Z = 65535, Q = "JFIF", ee = "Exif", te = "http://ns.adobe.com/xap/1.0/\0", ne = "http://ns.adobe.com/xmp/extension/\0", re = "Photoshop 3.0";
        function ie(e2, t2) {
          return e2.getUint16(t2) === G;
        }
        function oe(e2, t2) {
          return e2.getUint16(t2) === j;
        }
        function ae(e2, t2) {
          var n2 = N.length;
          return e2.getUint16(t2) === Y && a(e2, t2 + w, n2) === N;
        }
        function ue(e2, t2) {
          var n2 = B.length;
          return e2.getUint16(t2) === Y && a(e2, t2 + w, n2) === B;
        }
        function ce(e2, t2) {
          var n2 = Q.length;
          return e2.getUint16(t2) === X && a(e2, t2 + w, n2) === Q && 0 === e2.getUint8(t2 + w + n2);
        }
        function fe(e2, t2) {
          var n2 = ee.length;
          return e2.getUint16(t2) === J && a(e2, t2 + w, n2) === ee && 0 === e2.getUint8(t2 + w + n2);
        }
        function se(e2, t2) {
          return e2.getUint16(t2) === J && function(e3, t3) {
            var n2 = te.length;
            return a(e3, t3 + w, n2) === te;
          }(e2, t2);
        }
        function le(e2, t2) {
          return e2.getUint16(t2) === J && function(e3, t3) {
            var n2 = ne.length;
            return a(e3, t3 + w, n2) === ne;
          }(e2, t2);
        }
        function de(e2, t2) {
          return { dataOffset: e2 + F, length: t2 - (F - x) };
        }
        function pe(e2, t2) {
          return { dataOffset: e2 + R, length: t2 - (R - x) };
        }
        function me(e2, t2) {
          var n2 = re.length;
          return e2.getUint16(t2) === K && a(e2, t2 + w, n2) === re && 0 === e2.getUint8(t2 + w + n2);
        }
        function ge(e2, t2) {
          var n2 = e2.getUint16(t2);
          return n2 >= X && n2 <= q || n2 === $ || n2 === G || n2 === j || n2 === z || n2 === V || n2 === H || n2 === W;
        }
        function ve(e2, t2) {
          return e2.getUint16(t2) === Z;
        }
        var he = "\x89PNG\r\n\n", ye = 4, Se = 4, be = 0, Ie = ye, Ce = ye + Se, Ue = "XML:com.adobe.xmp\0", Pe = "tEXt", Ae = "iTXt", Ee = "zTXt", we = "pHYs", xe = "tIME", Te = "eXIf", Oe = "iCCP";
        function Me(e2, t2) {
          return "IHDR" === a(e2, t2 + Ie, Se);
        }
        function Fe(e2, t2) {
          return a(e2, t2 + Ie, Se) === Ae && a(e2, t2 + Ce, Ue.length) === Ue;
        }
        function Re(e2, t2, n2) {
          var r2 = a(e2, t2 + Ie, Se);
          return r2 === Pe || r2 === Ae || r2 === Ee && n2;
        }
        function ke(e2, t2) {
          return a(e2, t2 + Ie, Se) === Te;
        }
        function De(e2, t2) {
          return a(e2, t2 + Ie, Se) === Oe;
        }
        function Ne(e2, t2) {
          var n2 = [we, xe], r2 = a(e2, t2 + Ie, Se);
          return n2.includes(r2);
        }
        function Le(e2, t2) {
          t2 += Ce + Ue.length + 1 + 1;
          for (var n2 = 0; n2 < 2 && t2 < e2.byteLength; ) 0 === e2.getUint8(t2) && n2++, t2++;
          if (!(n2 < 2)) return t2;
        }
        function _e(e2, t2) {
          var n2 = u(e2, t2);
          return t2 += n2.length + 1, { profileName: n2, compressionMethod: e2.getUint8(t2), compressedProfileOffset: t2 += 1 };
        }
        function Be(e2, t2, n2, r2, i2, o2, a2, u2) {
          if (void 0 === u2) return [];
          for (var c2 = [], f2 = n2.items, s2 = 0; s2 < u2; s2++) {
            var l2 = { extents: [] };
            l2.itemId = Ge(e2, f2, t2), f2 += r2.item.itemId, l2.constructionMethod = 1 === t2 || 2 === t2 ? 15 & e2.getUint16(f2) : void 0, f2 += r2.item.constructionMethod, l2.dataReferenceIndex = e2.getUint16(f2), f2 += r2.item.dataReferenceIndex, l2.baseOffset = ze(e2, f2, r2.item.baseOffset), f2 += r2.item.baseOffset, l2.extentCount = e2.getUint16(f2), f2 += r2.item.extentCount;
            for (var d2 = 0; d2 < l2.extentCount; d2++) {
              var p2 = {};
              p2.extentIndex = je(e2, t2, f2, a2), f2 += r2.item.extent.extentIndex, p2.extentOffset = ze(e2, f2, i2), f2 += r2.item.extent.extentOffset, p2.extentLength = ze(e2, f2, o2), f2 += r2.item.extent.extentLength, l2.extents.push(p2);
            }
            c2.push(l2);
          }
          return c2;
        }
        function Ge(e2, t2, n2) {
          return n2 < 2 ? e2.getUint16(t2) : 2 === n2 ? e2.getUint32(t2) : void 0;
        }
        function je(e2, t2, n2, r2) {
          if ((1 === t2 || 2 === t2) && r2 > 0) return ze(e2, n2, r2);
        }
        function ze(e2, t2, n2) {
          return 4 === n2 ? e2.getUint32(t2) : 8 === n2 ? (console.warn("This file uses an 8-bit offset which is currently not supported by ExifReader. Contact the maintainer to get it fixed."), function(e3, t3) {
            return e3.getUint32(t3 + 4);
          }(e2, t2)) : 0;
        }
        var Ve = 1165519206, He = 1835625829;
        function We(e2, t2) {
          var n2 = function(e3, t3) {
            var n3 = e3.getUint32(t3);
            return /* @__PURE__ */ function(e4) {
              return 0 === e4;
            }(n3) ? { length: e3.byteLength - t3, contentOffset: t3 + 4 + 4 } : /* @__PURE__ */ function(e4) {
              return 1 === e4;
            }(n3) && function(e4, t4) {
              return 0 === e4.getUint32(t4 + 8);
            }(e3, t3) ? { length: e3.getUint32(t3 + 12), contentOffset: t3 + 4 + 4 + 8 } : { length: n3, contentOffset: t3 + 4 + 4 };
          }(e2, t2), r2 = n2.length, i2 = n2.contentOffset;
          if (!(r2 < 8)) {
            var o2 = e2.getUint32(t2 + 4);
            if (1718909296 === o2) return function(e3, t3, n3) {
              return { type: "ftyp", majorBrand: a(e3, t3, 4), length: n3 };
            }(e2, i2, r2);
            if (1768977008 === o2) return function(e3, t3, n3, r3) {
              return { type: "iprp", subBoxes: Ke(e3, n3, r3 - (n3 - t3)), length: r3 };
            }(e2, t2, i2, r2);
            if (1768973167 === o2) return function(e3, t3, n3, r3) {
              return { type: "ipco", properties: Ke(e3, n3, r3 - (n3 - t3)), length: r3 };
            }(e2, t2, i2, r2);
            if (1668246642 === o2) return function(e3, t3, n3) {
              return { type: "colr", icc: Ye(e3, t3), length: n3 };
            }(e2, i2, r2);
            var c2 = e2.getUint8(i2);
            return 1835365473 === o2 ? function(e3, t3, n3, r3) {
              return { type: "meta", subBoxes: Ke(e3, n3 + 3, r3 - (n3 + 3 - t3)), length: r3 };
            }(e2, t2, i2 + 1, r2) : 1768714083 === o2 ? function(e3, t3, n3, r3) {
              var i3 = function(e4, t4) {
                var n4 = { item: { dataReferenceIndex: 2, extentCount: 2, extent: {} } };
                e4 < 2 ? (n4.itemCount = 2, n4.item.itemId = 2) : 2 === e4 && (n4.itemCount = 4, n4.item.itemId = 4), n4.item.constructionMethod = 1 === e4 || 2 === e4 ? 2 : 0;
                var r4 = { offsetSize: t4, lengthSize: t4, baseOffsetSize: t4 + 1, indexSize: t4 + 1 };
                return r4.itemCount = t4 + 2, r4.items = r4.itemCount + n4.itemCount, r4.item = { itemId: 0 }, r4.item.constructionMethod = r4.item.itemId + n4.item.itemId, r4.item.dataReferenceIndex = r4.item.constructionMethod + n4.item.constructionMethod, { offsets: r4, sizes: n4 };
              }(t3, n3 + 3), o3 = i3.offsets, a2 = i3.sizes, u2 = e3.getUint8(o3.offsetSize) >> 4;
              a2.item.extent.extentOffset = u2;
              var c3 = 15 & e3.getUint8(o3.lengthSize);
              a2.item.extent.extentLength = c3;
              var f2 = e3.getUint8(o3.baseOffsetSize) >> 4;
              a2.item.baseOffset = f2;
              var s2 = function(e4, t4, n4) {
                if (1 === n4 || 2 === n4) return 15 & e4.getUint8(t4);
              }(e3, o3.indexSize, t3);
              a2.item.extent.extentIndex = void 0 !== s2 ? s2 : 0;
              var l2 = function(e4, t4, n4) {
                return n4 < 2 ? e4.getUint16(t4) : 2 === n4 ? e4.getUint32(t4) : void 0;
              }(e3, o3.itemCount, t3);
              return { type: "iloc", items: Be(e3, t3, o3, a2, u2, c3, s2, l2), length: r3 };
            }(e2, c2, i2 + 1, r2) : 1768517222 === o2 ? function(e3, t3, n3, r3, i3) {
              var o3 = function(e4, t4) {
                var n4 = { entryCount: t4 + 3 }, r4 = {};
                return r4.entryCount = 0 === e4 ? 2 : 4, n4.itemInfos = n4.entryCount + r4.entryCount, { offsets: n4 };
              }(n3, r3), a2 = o3.offsets;
              return { type: "iinf", itemInfos: Ke(e3, a2.itemInfos, i3 - (a2.itemInfos - t3)), length: i3 };
            }(e2, t2, c2, i2 + 1, r2) : 1768842853 === o2 ? function(e3, t3, n3, r3, i3) {
              r3 += 3;
              var o3 = { type: "infe", length: i3 };
              return 0 !== n3 && 1 !== n3 || (o3.itemId = e3.getUint16(r3), r3 += 2, o3.itemProtectionIndex = e3.getUint16(r3), r3 += 2, o3.itemName = u(e3, r3), r3 += o3.itemName.length + 1), n3 >= 2 && (2 === n3 ? (o3.itemId = e3.getUint16(r3), r3 += 2) : 3 === n3 && (o3.itemId = e3.getUint32(r3), r3 += 4), o3.itemProtectionIndex = e3.getUint16(r3), r3 += 2, o3.itemType = e3.getUint32(r3), r3 += 4, o3.itemName = u(e3, r3), r3 += o3.itemName.length + 1, o3.itemType === He ? (o3.contentType = u(e3, r3), t3 + i3 > (r3 += o3.contentType.length + 1) && (o3.contentEncoding = u(e3, r3), r3 += o3.contentEncoding.length + 1)) : 1970432288 === o3.itemType && (o3.itemUri = u(e3, r3), r3 += o3.itemUri.length + 1)), o3;
            }(e2, t2, c2, i2 + 1, r2) : { type: void 0, length: r2 };
          }
        }
        function Xe(e2) {
          if (h.USE_EXIF || h.USE_XMP || h.USE_ICC) {
            var t2 = {}, n2 = function(e3) {
              for (var t3 = 0; t3 + 4 + 4 <= e3.byteLength; ) {
                var n3 = We(e3, t3);
                if (void 0 === n3) break;
                if ("meta" === n3.type) return n3;
                t3 += n3.length;
              }
            }(e2);
            return n2 ? (h.USE_EXIF && (t2.tiffHeaderOffset = function(e3, t3) {
              try {
                var n3 = function(e4) {
                  return e4.subBoxes.find(function(e5) {
                    return "iinf" === e5.type;
                  }).itemInfos.find(function(e5) {
                    return e5.itemType === Ve;
                  });
                }(t3).itemId, r2 = Je(t3, n3);
                return function(e4, t4) {
                  return t4 + 4 + e4.getUint32(t4);
                }(e3, r2.baseOffset + r2.extents[0].extentOffset);
              } catch (e4) {
                return;
              }
            }(e2, n2)), h.USE_XMP && (t2.xmpChunks = function(e3) {
              try {
                var t3 = function(e4) {
                  return e4.subBoxes.find(function(e5) {
                    return "iinf" === e5.type;
                  }).itemInfos.find(function(e5) {
                    return e5.itemType === He && "application/rdf+xml" === e5.contentType;
                  });
                }(e3).itemId, n3 = Je(e3, t3), r2 = Je(e3, t3).extents[0];
                return [{ dataOffset: n3.baseOffset + r2.extentOffset, length: r2.extentLength }];
              } catch (e4) {
                return;
              }
            }(n2)), h.USE_ICC && (t2.iccChunks = function(e3) {
              try {
                var t3 = e3.subBoxes.find(function(e4) {
                  return "iprp" === e4.type;
                }).subBoxes.find(function(e4) {
                  return "ipco" === e4.type;
                }).properties.find(function(e4) {
                  return "colr" === e4.type;
                }).icc;
                if (t3) return [t3];
              } catch (e4) {
              }
            }(n2)), t2.hasAppMarkers = void 0 !== t2.tiffHeaderOffset || void 0 !== t2.xmpChunks || void 0 !== t2.iccChunks, t2) : { hasAppMarkers: 0 };
          }
          return {};
        }
        function Je(e2, t2) {
          return e2.subBoxes.find(function(e3) {
            return "iloc" === e3.type;
          }).items.find(function(e3) {
            return e3.itemId === t2;
          });
        }
        function Ye(e2, t2) {
          var n2 = a(e2, t2, 4);
          if ("prof" === n2 || "rICC" === n2) return { offset: t2 + 4, length: e2.getUint32(t2 + 4), chunkNumber: 1, chunksTotal: 1 };
        }
        function Ke(e2, t2, n2) {
          for (var r2 = [Ve, He], i2 = [], o2 = t2; o2 < t2 + n2; ) {
            var a2 = We(e2, o2);
            if (void 0 === a2) break;
            void 0 === a2.type || void 0 !== a2.itemType && -1 === r2.indexOf(a2.itemType) || i2.push(a2), o2 += a2.length;
          }
          return i2;
        }
        var qe = 6, $e = ["GIF87a", "GIF89a"], Ze = 0, Qe = "<?xpacket begin", et = { parseAppMarkers: function(e2, t2) {
          if (h.USE_TIFF && function(e3) {
            return !!e3 && e3.byteLength >= 4 && function(e4) {
              var t3 = e4.getUint16(0) === C;
              return 42 === e4.getUint16(2, t3);
            }(e3);
          }(e2)) return tt(h.USE_EXIF ? { hasAppMarkers: 1, tiffHeaderOffset: 0 } : {}, "tiff", "TIFF");
          if (h.USE_JPEG && function(e3) {
            return !!e3 && e3.byteLength >= P && e3.getUint16(0) === A;
          }(e2)) return tt(function(e3) {
            for (var t3, n2, r2, i2, o2, a2, u2, c2, f2, s2 = E; s2 + w + 5 <= e3.byteLength; ) {
              if (h.USE_FILE && ie(e3, s2)) t3 = e3.getUint16(s2 + x), n2 = s2 + x;
              else if (h.USE_FILE && oe(e3, s2)) t3 = e3.getUint16(s2 + x), r2 = s2 + x;
              else if (h.USE_JFIF && ce(e3, s2)) t3 = e3.getUint16(s2 + x), i2 = s2 + T;
              else if (h.USE_EXIF && fe(e3, s2)) t3 = e3.getUint16(s2 + x), o2 = s2 + O;
              else if (h.USE_XMP && se(e3, s2)) u2 || (u2 = []), t3 = e3.getUint16(s2 + x), u2.push(de(s2, t3));
              else if (h.USE_XMP && le(e3, s2)) u2 || (u2 = []), t3 = e3.getUint16(s2 + x), u2.push(pe(s2, t3));
              else if (h.USE_IPTC && me(e3, s2)) t3 = e3.getUint16(s2 + x), a2 = s2 + M;
              else if (h.USE_ICC && ae(e3, s2)) {
                t3 = e3.getUint16(s2 + x);
                var l2 = s2 + k, d2 = t3 - (k - x), p2 = e3.getUint8(s2 + L), m2 = e3.getUint8(s2 + _);
                c2 || (c2 = []), c2.push({ offset: l2, length: d2, chunkNumber: p2, chunksTotal: m2 });
              } else if (h.USE_MPF && ue(e3, s2)) t3 = e3.getUint16(s2 + x), f2 = s2 + D;
              else {
                if (!ge(e3, s2)) {
                  if (ve(e3, s2)) {
                    s2++;
                    continue;
                  }
                  break;
                }
                t3 = e3.getUint16(s2 + x);
              }
              s2 += x + t3;
            }
            return { hasAppMarkers: s2 > E, fileDataOffset: n2 || r2, jfifDataOffset: i2, tiffHeaderOffset: o2, iptcDataOffset: a2, xmpChunks: u2, iccChunks: c2, mpfDataOffset: f2 };
          }(e2), "jpeg", "JPEG");
          if (h.USE_PNG && function(e3) {
            return !!e3 && a(e3, 0, he.length) === he;
          }(e2)) return tt(function(e3, t3) {
            for (var n2 = { hasAppMarkers: 0 }, r2 = he.length; r2 + ye + Se <= e3.byteLength; ) {
              if (h.USE_PNG_FILE && Me(e3, r2)) n2.hasAppMarkers = 1, n2.pngHeaderOffset = r2 + Ce;
              else if (h.USE_XMP && Fe(e3, r2)) {
                var i2 = Le(e3, r2);
                void 0 !== i2 && (n2.hasAppMarkers = 1, n2.xmpChunks = [{ dataOffset: i2, length: e3.getUint32(r2 + be) - (i2 - (r2 + Ce)) }]);
              } else if (Re(e3, r2, t3)) {
                n2.hasAppMarkers = 1;
                var o2 = a(e3, r2 + Ie, Se);
                n2.pngTextChunks || (n2.pngTextChunks = []), n2.pngTextChunks.push({ length: e3.getUint32(r2 + be), type: o2, offset: r2 + Ce });
              } else if (ke(e3, r2)) n2.hasAppMarkers = 1, n2.tiffHeaderOffset = r2 + Ce;
              else if (h.USE_ICC && t3 && De(e3, r2)) {
                n2.hasAppMarkers = 1;
                var u2 = e3.getUint32(r2 + be), c2 = r2 + Ce, f2 = _e(e3, c2), s2 = f2.profileName, l2 = f2.compressionMethod, d2 = f2.compressedProfileOffset;
                n2.iccChunks || (n2.iccChunks = []), n2.iccChunks.push({ offset: d2, length: u2 - (d2 - c2), chunkNumber: 1, chunksTotal: 1, profileName: s2, compressionMethod: l2 });
              } else Ne(e3, r2) && (n2.hasAppMarkers = 1, n2.pngChunkOffsets || (n2.pngChunkOffsets = []), n2.pngChunkOffsets.push(r2 + be));
              r2 += e3.getUint32(r2 + be) + ye + Se + 4;
            }
            return n2;
          }(e2, t2), "png", "PNG");
          if (h.USE_HEIC && function(e3) {
            if (!e3) return 0;
            try {
              var t3 = We(e3, 0);
              return t3 && -1 !== ["heic", "heix", "hevc", "hevx", "heim", "heis", "hevm", "hevs", "mif1"].indexOf(t3.majorBrand);
            } catch (e4) {
              return 0;
            }
          }(e2)) return tt(function(e3) {
            return Xe(e3);
          }(e2), "heic", "HEIC");
          if (h.USE_AVIF && function(e3) {
            if (!e3) return 0;
            try {
              var t3 = We(e3, 0);
              return t3 && "avif" === t3.majorBrand;
            } catch (e4) {
              return 0;
            }
          }(e2)) return tt(function(e3) {
            return Xe(e3);
          }(e2), "avif", "AVIF");
          if (h.USE_WEBP && function(e3) {
            return !!e3 && "RIFF" === a(e3, 0, 4) && "WEBP" === a(e3, 8, 4);
          }(e2)) return tt(function(e3) {
            for (var t3, n2, r2, i2, o2 = 12, u2 = 0; o2 + 8 < e3.byteLength; ) {
              var c2 = a(e3, o2, 4), f2 = e3.getUint32(o2 + 4, 1);
              h.USE_EXIF && "EXIF" === c2 ? (u2 = 1, t3 = "Exif\0\0" === a(e3, o2 + 8, 6) ? o2 + 8 + 6 : o2 + 8) : h.USE_XMP && "XMP " === c2 ? (u2 = 1, n2 = [{ dataOffset: o2 + 8, length: f2 }]) : h.USE_ICC && "ICCP" === c2 ? (u2 = 1, r2 = [{ offset: o2 + 8, length: f2, chunkNumber: 1, chunksTotal: 1 }]) : "VP8X" === c2 && (u2 = 1, i2 = o2 + 8), o2 += 8 + (f2 % 2 == 0 ? f2 : f2 + 1);
            }
            return { hasAppMarkers: u2, tiffHeaderOffset: t3, xmpChunks: n2, iccChunks: r2, vp8xChunkOffset: i2 };
          }(e2), "webp", "WebP");
          if (h.USE_GIF && function(e3) {
            return !!e3 && $e.includes(a(e3, 0, qe));
          }(e2)) return tt({ gifHeaderOffset: 0 }, "gif", "GIF");
          if (h.USE_XMP && function(e3) {
            return !!e3 && a(e3, Ze, Qe.length) === Qe;
          }(e2)) return tt(function(e3) {
            var t3 = [];
            return t3.push({ dataOffset: Ze, length: e3.byteLength }), { xmpChunks: t3 };
          }(e2), "xml", "XML");
          throw Error("Invalid image format");
        } };
        function tt(e2, t2, n2) {
          return l({}, e2, { fileType: { value: t2, description: n2 } });
        }
        var nt = { ApertureValue: function(e2) {
          return Math.pow(Math.sqrt(2), e2[0] / e2[1]).toFixed(2);
        }, ColorSpace: function(e2) {
          return 1 === e2 ? "sRGB" : 65535 === e2 ? "Uncalibrated" : "Unknown";
        }, ComponentsConfiguration: function(e2) {
          return e2.map(function(e3) {
            return 49 === e3 ? "Y" : 50 === e3 ? "Cb" : 51 === e3 ? "Cr" : 52 === e3 ? "R" : 53 === e3 ? "G" : 54 === e3 ? "B" : void 0;
          }).join("");
        }, Contrast: function(e2) {
          return 0 === e2 ? "Normal" : 1 === e2 ? "Soft" : 2 === e2 ? "Hard" : "Unknown";
        }, CustomRendered: function(e2) {
          return 0 === e2 ? "Normal process" : 1 === e2 ? "Custom process" : "Unknown";
        }, ExposureMode: function(e2) {
          return 0 === e2 ? "Auto exposure" : 1 === e2 ? "Manual exposure" : 2 === e2 ? "Auto bracket" : "Unknown";
        }, ExposureProgram: function(e2) {
          return 0 === e2 ? "Undefined" : 1 === e2 ? "Manual" : 2 === e2 ? "Normal program" : 3 === e2 ? "Aperture priority" : 4 === e2 ? "Shutter priority" : 5 === e2 ? "Creative program" : 6 === e2 ? "Action program" : 7 === e2 ? "Portrait mode" : 8 === e2 ? "Landscape mode" : 9 === e2 ? "Bulb" : "Unknown";
        }, ExposureTime: function(e2) {
          if (e2[0] / e2[1] > 0.25) {
            var t2 = e2[0] / e2[1];
            return Number.isInteger(t2) ? "" + t2 : t2.toFixed(1);
          }
          return 0 !== e2[0] ? "1/".concat(Math.round(e2[1] / e2[0])) : "0/".concat(e2[1]);
        }, FNumber: function(e2) {
          return "f/".concat(Number(e2[0] / e2[1]).toFixed(1));
        }, FocalLength: function(e2) {
          return e2[0] / e2[1] + " mm";
        }, FocalPlaneResolutionUnit: function(e2) {
          return 2 === e2 ? "inches" : 3 === e2 ? "centimeters" : "Unknown";
        }, LightSource: function(e2) {
          return 1 === e2 ? "Daylight" : 2 === e2 ? "Fluorescent" : 3 === e2 ? "Tungsten (incandescent light)" : 4 === e2 ? "Flash" : 9 === e2 ? "Fine weather" : 10 === e2 ? "Cloudy weather" : 11 === e2 ? "Shade" : 12 === e2 ? "Daylight fluorescent (D 5700 \u2013 7100K)" : 13 === e2 ? "Day white fluorescent (N 4600 \u2013 5400K)" : 14 === e2 ? "Cool white fluorescent (W 3900 \u2013 4500K)" : 15 === e2 ? "White fluorescent (WW 3200 \u2013 3700K)" : 17 === e2 ? "Standard light A" : 18 === e2 ? "Standard light B" : 19 === e2 ? "Standard light C" : 20 === e2 ? "D55" : 21 === e2 ? "D65" : 22 === e2 ? "D75" : 23 === e2 ? "D50" : 24 === e2 ? "ISO studio tungsten" : 255 === e2 ? "Other light source" : "Unknown";
        }, MeteringMode: function(e2) {
          return 1 === e2 ? "Average" : 2 === e2 ? "CenterWeightedAverage" : 3 === e2 ? "Spot" : 4 === e2 ? "MultiSpot" : 5 === e2 ? "Pattern" : 6 === e2 ? "Partial" : 255 === e2 ? "Other" : "Unknown";
        }, ResolutionUnit: function(e2) {
          return 2 === e2 ? "inches" : 3 === e2 ? "centimeters" : "Unknown";
        }, Saturation: function(e2) {
          return 0 === e2 ? "Normal" : 1 === e2 ? "Low saturation" : 2 === e2 ? "High saturation" : "Unknown";
        }, SceneCaptureType: function(e2) {
          return 0 === e2 ? "Standard" : 1 === e2 ? "Landscape" : 2 === e2 ? "Portrait" : 3 === e2 ? "Night scene" : "Unknown";
        }, Sharpness: function(e2) {
          return 0 === e2 ? "Normal" : 1 === e2 ? "Soft" : 2 === e2 ? "Hard" : "Unknown";
        }, ShutterSpeedValue: function(e2) {
          var t2 = Math.pow(2, e2[0] / e2[1]);
          return t2 <= 1 ? "".concat(Math.round(1 / t2)) : "1/".concat(Math.round(t2));
        }, WhiteBalance: function(e2) {
          return 0 === e2 ? "Auto white balance" : 1 === e2 ? "Manual white balance" : "Unknown";
        }, XResolution: function(e2) {
          return "" + Math.round(e2[0] / e2[1]);
        }, YResolution: function(e2) {
          return "" + Math.round(e2[0] / e2[1]);
        } }, rt = { 11: "ProcessingSoftware", 254: { name: "SubfileType", description: function(e2) {
          return { 0: "Full-resolution image", 1: "Reduced-resolution image", 2: "Single page of multi-page image", 3: "Single page of multi-page reduced-resolution image", 4: "Transparency mask", 5: "Transparency mask of reduced-resolution image", 6: "Transparency mask of multi-page image", 7: "Transparency mask of reduced-resolution multi-page image", 65537: "Alternate reduced-resolution image", 4294967295: "Invalid" }[e2] || "Unknown";
        } }, 255: { name: "OldSubfileType", description: function(e2) {
          return { 0: "Full-resolution image", 1: "Reduced-resolution image", 2: "Single page of multi-page image" }[e2] || "Unknown";
        } }, 256: "ImageWidth", 257: "ImageLength", 258: "BitsPerSample", 259: "Compression", 262: "PhotometricInterpretation", 263: { name: "Thresholding", description: function(e2) {
          return { 1: "No dithering or halftoning", 2: "Ordered dither or halfton", 3: "Randomized dither" }[e2] || "Unknown";
        } }, 264: "CellWidth", 265: "CellLength", 266: { name: "FillOrder", description: function(e2) {
          return { 1: "Normal", 2: "Reversed" }[e2] || "Unknown";
        } }, 269: "DocumentName", 270: "ImageDescription", 271: "Make", 272: "Model", 273: "StripOffsets", 274: { name: "Orientation", description: function(e2) {
          return 1 === e2 ? "top-left" : 2 === e2 ? "top-right" : 3 === e2 ? "bottom-right" : 4 === e2 ? "bottom-left" : 5 === e2 ? "left-top" : 6 === e2 ? "right-top" : 7 === e2 ? "right-bottom" : 8 === e2 ? "left-bottom" : "Undefined";
        } }, 277: "SamplesPerPixel", 278: "RowsPerStrip", 279: "StripByteCounts", 280: "MinSampleValue", 281: "MaxSampleValue", 282: { name: "XResolution", description: nt.XResolution }, 283: { name: "YResolution", description: nt.YResolution }, 284: "PlanarConfiguration", 285: "PageName", 286: { name: "XPosition", description: function(e2) {
          return "" + Math.round(e2[0] / e2[1]);
        } }, 287: { name: "YPosition", description: function(e2) {
          return "" + Math.round(e2[0] / e2[1]);
        } }, 290: { name: "GrayResponseUnit", description: function(e2) {
          return { 1: "0.1", 2: "0.001", 3: "0.0001", 4: "1e-05", 5: "1e-06" }[e2] || "Unknown";
        } }, 296: { name: "ResolutionUnit", description: nt.ResolutionUnit }, 297: "PageNumber", 301: "TransferFunction", 305: "Software", 306: "DateTime", 315: "Artist", 316: "HostComputer", 317: "Predictor", 318: { name: "WhitePoint", description: function(e2) {
          return e2.map(function(e3) {
            return "".concat(e3[0], "/").concat(e3[1]);
          }).join(", ");
        } }, 319: { name: "PrimaryChromaticities", description: function(e2) {
          return e2.map(function(e3) {
            return "".concat(e3[0], "/").concat(e3[1]);
          }).join(", ");
        } }, 321: "HalftoneHints", 322: "TileWidth", 323: "TileLength", 330: "A100DataOffset", 332: { name: "InkSet", description: function(e2) {
          return { 1: "CMYK", 2: "Not CMYK" }[e2] || "Unknown";
        } }, 337: "TargetPrinter", 338: { name: "ExtraSamples", description: function(e2) {
          return { 0: "Unspecified", 1: "Associated Alpha", 2: "Unassociated Alpha" }[e2] || "Unknown";
        } }, 339: { name: "SampleFormat", description: function(e2) {
          var t2 = { 1: "Unsigned", 2: "Signed", 3: "Float", 4: "Undefined", 5: "Complex int", 6: "Complex float" };
          return Array.isArray(e2) ? e2.map(function(e3) {
            return t2[e3] || "Unknown";
          }).join(", ") : "Unknown";
        } }, 513: "JPEGInterchangeFormat", 514: "JPEGInterchangeFormatLength", 529: { name: "YCbCrCoefficients", description: function(e2) {
          return e2.map(function(e3) {
            return "" + e3[0] / e3[1];
          }).join("/");
        } }, 530: "YCbCrSubSampling", 531: { name: "YCbCrPositioning", description: function(e2) {
          return 1 === e2 ? "centered" : 2 === e2 ? "co-sited" : "undefined " + e2;
        } }, 532: { name: "ReferenceBlackWhite", description: function(e2) {
          return e2.map(function(e3) {
            return "" + e3[0] / e3[1];
          }).join(", ");
        } }, 700: "ApplicationNotes", 18246: "Rating", 18249: "RatingPercent", 33432: { name: "Copyright", description: function(e2) {
          return e2.join("; ");
        } }, 33550: "PixelScale", 33723: "IPTC-NAA", 33920: "IntergraphMatrix", 33922: "ModelTiePoint", 34118: "SEMInfo", 34264: "ModelTransform", 34377: "PhotoshopSettings", 34665: "Exif IFD Pointer", 34675: "ICC_Profile", 34735: "GeoTiffDirectory", 34736: "GeoTiffDoubleParams", 34737: "GeoTiffAsciiParams", 34853: "GPS Info IFD Pointer", 40091: { name: "XPTitle", description: it }, 40092: { name: "XPComment", description: it }, 40093: { name: "XPAuthor", description: it }, 40094: { name: "XPKeywords", description: it }, 40095: { name: "XPSubject", description: it }, 42112: "GDALMetadata", 42113: "GDALNoData", 50341: "PrintIM", 50707: "DNGBackwardVersion", 50708: "UniqueCameraModel", 50709: "LocalizedCameraModel", 50721: "ColorMatrix1", 50722: "ColorMatrix2", 50723: "CameraCalibration1", 50724: "CameraCalibration2", 50725: "ReductionMatrix1", 50726: "ReductionMatrix2", 50727: "AnalogBalance", 50728: "AsShotNeutral", 50729: "AsShotWhiteXY", 50730: "BaselineExposure", 50731: "BaselineNoise", 50732: "BaselineSharpness", 50734: "LinearResponseLimit", 50735: "CameraSerialNumber", 50736: "DNGLensInfo", 50739: "ShadowScale", 50741: { name: "MakerNoteSafety", description: function(e2) {
          return { 0: "Unsafe", 1: "Safe" }[e2] || "Unknown";
        } }, 50778: { name: "CalibrationIlluminant1", description: nt.LightSource }, 50779: { name: "CalibrationIlluminant2", description: nt.LightSource }, 50781: "RawDataUniqueID", 50827: "OriginalRawFileName", 50828: "OriginalRawFileData", 50831: "AsShotICCProfile", 50832: "AsShotPreProfileMatrix", 50833: "CurrentICCProfile", 50834: "CurrentPreProfileMatrix", 50879: "ColorimetricReference", 50885: "SRawType", 50898: "PanasonicTitle", 50899: "PanasonicTitle2", 50931: "CameraCalibrationSig", 50932: "ProfileCalibrationSig", 50933: "ProfileIFD", 50934: "AsShotProfileName", 50936: "ProfileName", 50937: "ProfileHueSatMapDims", 50938: "ProfileHueSatMapData1", 50939: "ProfileHueSatMapData2", 50940: "ProfileToneCurve", 50941: { name: "ProfileEmbedPolicy", description: function(e2) {
          return { 0: "Allow Copying", 1: "Embed if Used", 2: "Never Embed", 3: "No Restrictions" }[e2] || "Unknown";
        } }, 50942: "ProfileCopyright", 50964: "ForwardMatrix1", 50965: "ForwardMatrix2", 50966: "PreviewApplicationName", 50967: "PreviewApplicationVersion", 50968: "PreviewSettingsName", 50969: "PreviewSettingsDigest", 50970: { name: "PreviewColorSpace", description: function(e2) {
          return { 1: "Gray Gamma 2.2", 2: "sRGB", 3: "Adobe RGB", 4: "ProPhoto RGB" }[e2] || "Unknown";
        } }, 50971: "PreviewDateTime", 50972: "RawImageDigest", 50973: "OriginalRawFileDigest", 50981: "ProfileLookTableDims", 50982: "ProfileLookTableData", 51043: "TimeCodes", 51044: "FrameRate", 51058: "TStop", 51081: "ReelName", 51089: "OriginalDefaultFinalSize", 51090: "OriginalBestQualitySize", 51091: "OriginalDefaultCropSize", 51105: "CameraLabel", 51107: { name: "ProfileHueSatMapEncoding", description: function(e2) {
          return { 0: "Linear", 1: "sRGB" }[e2] || "Unknown";
        } }, 51108: { name: "ProfileLookTableEncoding", description: function(e2) {
          return { 0: "Linear", 1: "sRGB" }[e2] || "Unknown";
        } }, 51109: "BaselineExposureOffset", 51110: { name: "DefaultBlackRender", description: function(e2) {
          return { 0: "Auto", 1: "None" }[e2] || "Unknown";
        } }, 51111: "NewRawImageDigest", 51112: "RawToPreviewGain" };
        function it(e2) {
          return new TextDecoder("utf-16").decode(new Uint8Array(e2)).replace(/\u0000+$/, "");
        }
        function ot(e2, t2) {
          (null == t2 || t2 > e2.length) && (t2 = e2.length);
          for (var n2 = 0, r2 = Array(t2); n2 < t2; n2++) r2[n2] = e2[n2];
          return r2;
        }
        function at(e2, t2) {
          (null == t2 || t2 > e2.length) && (t2 = e2.length);
          for (var n2 = 0, r2 = Array(t2); n2 < t2; n2++) r2[n2] = e2[n2];
          return r2;
        }
        var ut = { 0: { name: "GPSVersionID", description: function(e2) {
          return 2 === e2[0] && 2 === e2[1] && 0 === e2[2] && 0 === e2[3] ? "Version 2.2" : "Unknown";
        } }, 1: { name: "GPSLatitudeRef", description: function(e2) {
          var t2 = e2.join("");
          return "N" === t2 ? "North latitude" : "S" === t2 ? "South latitude" : "Unknown";
        } }, 2: { name: "GPSLatitude", description: b }, 3: { name: "GPSLongitudeRef", description: function(e2) {
          var t2 = e2.join("");
          return "E" === t2 ? "East longitude" : "W" === t2 ? "West longitude" : "Unknown";
        } }, 4: { name: "GPSLongitude", description: b }, 5: { name: "GPSAltitudeRef", description: function(e2) {
          return 0 === e2 ? "Sea level" : 1 === e2 ? "Sea level reference (negative value)" : "Unknown";
        } }, 6: { name: "GPSAltitude", description: function(e2) {
          return e2[0] / e2[1] + " m";
        } }, 7: { name: "GPSTimeStamp", description: function(e2) {
          return e2.map(function(e3) {
            var t2, n2 = function(e4) {
              if (Array.isArray(e4)) return e4;
            }(t2 = e3) || function(e4) {
              var t3 = null == e4 ? null : "undefined" != typeof Symbol && e4[Symbol.iterator] || e4["@@iterator"];
              if (null != t3) {
                var n3, r3, i2, o2, a2 = [], u2 = 1, c2 = 0;
                try {
                  for (i2 = (t3 = t3.call(e4)).next, false; !(u2 = (n3 = i2.call(t3)).done) && (a2.push(n3.value), 2 !== a2.length); u2 = 1) ;
                } catch (e5) {
                  c2 = 1, r3 = e5;
                } finally {
                  try {
                    if (!u2 && null != t3.return && (o2 = t3.return(), Object(o2) !== o2)) return;
                  } finally {
                    if (c2) throw r3;
                  }
                }
                return a2;
              }
            }(t2) || function(e4) {
              if (e4) {
                if ("string" == typeof e4) return at(e4, 2);
                var t3 = {}.toString.call(e4).slice(8, -1);
                return "Object" === t3 && e4.constructor && (t3 = e4.constructor.name), "Map" === t3 || "Set" === t3 ? Array.from(e4) : "Arguments" === t3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t3) ? at(e4, 2) : void 0;
              }
            }(t2) || function() {
              throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }(), r2 = n2[0] / n2[1];
            return /^\d(\.|$)/.test("".concat(r2)) ? "0".concat(r2) : r2;
          }).join(":");
        } }, 8: "GPSSatellites", 9: { name: "GPSStatus", description: function(e2) {
          var t2 = e2.join("");
          return "A" === t2 ? "Measurement in progress" : "V" === t2 ? "Measurement Interoperability" : "Unknown";
        } }, 10: { name: "GPSMeasureMode", description: function(e2) {
          var t2 = e2.join("");
          return "2" === t2 ? "2-dimensional measurement" : "3" === t2 ? "3-dimensional measurement" : "Unknown";
        } }, 11: "GPSDOP", 12: { name: "GPSSpeedRef", description: function(e2) {
          var t2 = e2.join("");
          return "K" === t2 ? "Kilometers per hour" : "M" === t2 ? "Miles per hour" : "N" === t2 ? "Knots" : "Unknown";
        } }, 13: "GPSSpeed", 14: { name: "GPSTrackRef", description: function(e2) {
          var t2 = e2.join("");
          return "T" === t2 ? "True direction" : "M" === t2 ? "Magnetic direction" : "Unknown";
        } }, 15: "GPSTrack", 16: { name: "GPSImgDirectionRef", description: function(e2) {
          var t2 = e2.join("");
          return "T" === t2 ? "True direction" : "M" === t2 ? "Magnetic direction" : "Unknown";
        } }, 17: "GPSImgDirection", 18: "GPSMapDatum", 19: { name: "GPSDestLatitudeRef", description: function(e2) {
          var t2 = e2.join("");
          return "N" === t2 ? "North latitude" : "S" === t2 ? "South latitude" : "Unknown";
        } }, 20: { name: "GPSDestLatitude", description: function(e2) {
          return e2[0][0] / e2[0][1] + e2[1][0] / e2[1][1] / 60 + e2[2][0] / e2[2][1] / 3600;
        } }, 21: { name: "GPSDestLongitudeRef", description: function(e2) {
          var t2 = e2.join("");
          return "E" === t2 ? "East longitude" : "W" === t2 ? "West longitude" : "Unknown";
        } }, 22: { name: "GPSDestLongitude", description: function(e2) {
          return e2[0][0] / e2[0][1] + e2[1][0] / e2[1][1] / 60 + e2[2][0] / e2[2][1] / 3600;
        } }, 23: { name: "GPSDestBearingRef", description: function(e2) {
          var t2 = e2.join("");
          return "T" === t2 ? "True direction" : "M" === t2 ? "Magnetic direction" : "Unknown";
        } }, 24: "GPSDestBearing", 25: { name: "GPSDestDistanceRef", description: function(e2) {
          var t2 = e2.join("");
          return "K" === t2 ? "Kilometers" : "M" === t2 ? "Miles" : "N" === t2 ? "Knots" : "Unknown";
        } }, 26: "GPSDestDistance", 27: { name: "GPSProcessingMethod", description: S }, 28: { name: "GPSAreaInformation", description: S }, 29: "GPSDateStamp", 30: { name: "GPSDifferential", description: function(e2) {
          return 0 === e2 ? "Measurement without differential correction" : 1 === e2 ? "Differential correction applied" : "Unknown";
        } }, 31: "GPSHPositioningError" }, ct = { 1: "InteroperabilityIndex", 2: { name: "InteroperabilityVersion", description: function(e2) {
          return y(e2);
        } }, 4096: "RelatedImageFileFormat", 4097: "RelatedImageWidth", 4098: "RelatedImageHeight" }, ft = { 45056: { name: "MPFVersion", description: function(e2) {
          return y(e2);
        } }, 45057: "NumberOfImages", 45058: "MPEntry", 45059: "ImageUIDList", 45060: "TotalFrames" };
        function st(e2) {
          return st = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e3) {
            return typeof e3;
          } : function(e3) {
            return e3 && "function" == typeof Symbol && e3.constructor === Symbol && e3 !== Symbol.prototype ? "symbol" : typeof e3;
          }, st(e2);
        }
        function lt(e2, t2, n2) {
          return (t2 = function(e3) {
            var t3 = function(e4) {
              if ("object" != st(e4) || !e4) return e4;
              var t4 = e4[Symbol.toPrimitive];
              if (void 0 !== t4) {
                var n3 = t4.call(e4, "string");
                if ("object" != st(n3)) return n3;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return e4 + "";
            }(e3);
            return "symbol" == st(t3) ? t3 : t3 + "";
          }(t2)) in e2 ? Object.defineProperty(e2, t2, { value: n2, enumerable: 1, configurable: 1, writable: 1 }) : e2[t2] = n2, e2;
        }
        var dt = l({}, rt, { 33434: { name: "ExposureTime", description: nt.ExposureTime }, 33437: { name: "FNumber", description: nt.FNumber }, 34850: { name: "ExposureProgram", description: nt.ExposureProgram }, 34852: "SpectralSensitivity", 34855: "ISOSpeedRatings", 34856: { name: "OECF", description: function() {
          return "[Raw OECF table data]";
        } }, 34858: "TimeZoneOffset", 34859: "SelfTimerMode", 34864: { name: "SensitivityType", description: function(e2) {
          return { 1: "Standard Output Sensitivity", 2: "Recommended Exposure Index", 3: "ISO Speed", 4: "Standard Output Sensitivity and Recommended Exposure Index", 5: "Standard Output Sensitivity and ISO Speed", 6: "Recommended Exposure Index and ISO Speed", 7: "Standard Output Sensitivity, Recommended Exposure Index and ISO Speed" }[e2] || "Unknown";
        } }, 34865: "StandardOutputSensitivity", 34866: "RecommendedExposureIndex", 34867: "ISOSpeed", 34868: "ISOSpeedLatitudeyyy", 34869: "ISOSpeedLatitudezzz", 36864: { name: "ExifVersion", description: function(e2) {
          return y(e2);
        } }, 36867: "DateTimeOriginal", 36868: "DateTimeDigitized", 36873: "GooglePlusUploadCode", 36880: "OffsetTime", 36881: "OffsetTimeOriginal", 36882: "OffsetTimeDigitized", 37121: { name: "ComponentsConfiguration", description: nt.ComponentsConfiguration }, 37122: "CompressedBitsPerPixel", 37377: { name: "ShutterSpeedValue", description: nt.ShutterSpeedValue }, 37378: { name: "ApertureValue", description: nt.ApertureValue }, 37379: "BrightnessValue", 37380: "ExposureBiasValue", 37381: { name: "MaxApertureValue", description: function(e2) {
          return Math.pow(Math.sqrt(2), e2[0] / e2[1]).toFixed(2);
        } }, 37382: { name: "SubjectDistance", description: function(e2) {
          return e2[0] / e2[1] + " m";
        } }, 37383: { name: "MeteringMode", description: nt.MeteringMode }, 37384: { name: "LightSource", description: nt.LightSource }, 37385: { name: "Flash", description: function(e2) {
          return 0 === e2 ? "Flash did not fire" : 1 === e2 ? "Flash fired" : 5 === e2 ? "Strobe return light not detected" : 7 === e2 ? "Strobe return light detected" : 9 === e2 ? "Flash fired, compulsory flash mode" : 13 === e2 ? "Flash fired, compulsory flash mode, return light not detected" : 15 === e2 ? "Flash fired, compulsory flash mode, return light detected" : 16 === e2 ? "Flash did not fire, compulsory flash mode" : 24 === e2 ? "Flash did not fire, auto mode" : 25 === e2 ? "Flash fired, auto mode" : 29 === e2 ? "Flash fired, auto mode, return light not detected" : 31 === e2 ? "Flash fired, auto mode, return light detected" : 32 === e2 ? "No flash function" : 65 === e2 ? "Flash fired, red-eye reduction mode" : 69 === e2 ? "Flash fired, red-eye reduction mode, return light not detected" : 71 === e2 ? "Flash fired, red-eye reduction mode, return light detected" : 73 === e2 ? "Flash fired, compulsory flash mode, red-eye reduction mode" : 77 === e2 ? "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected" : 79 === e2 ? "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected" : 89 === e2 ? "Flash fired, auto mode, red-eye reduction mode" : 93 === e2 ? "Flash fired, auto mode, return light not detected, red-eye reduction mode" : 95 === e2 ? "Flash fired, auto mode, return light detected, red-eye reduction mode" : "Unknown";
        } }, 37386: { name: "FocalLength", description: nt.FocalLength }, 37393: "ImageNumber", 37394: { name: "SecurityClassification", description: function(e2) {
          return { C: "Confidential", R: "Restricted", S: "Secret", T: "Top Secret", U: "Unclassified" }[e2] || "Unknown";
        } }, 37395: "ImageHistory", 37396: { name: "SubjectArea", description: function(e2) {
          return 2 === e2.length ? "Location; X: ".concat(e2[0], ", Y: ").concat(e2[1]) : 3 === e2.length ? "Circle; X: ".concat(e2[0], ", Y: ").concat(e2[1], ", diameter: ").concat(e2[2]) : 4 === e2.length ? "Rectangle; X: ".concat(e2[0], ", Y: ").concat(e2[1], ", width: ").concat(e2[2], ", height: ").concat(e2[3]) : "Unknown";
        } }, 37500: { name: "MakerNote", description: function() {
          return "[Raw maker note data]";
        } }, 37510: { name: "UserComment", description: S }, 37520: "SubSecTime", 37521: "SubSecTimeOriginal", 37522: "SubSecTimeDigitized", 37724: "ImageSourceData", 37888: { name: "AmbientTemperature", description: function(e2) {
          return e2[0] / e2[1] + " \xB0C";
        } }, 37889: { name: "Humidity", description: function(e2) {
          return e2[0] / e2[1] + " %";
        } }, 37890: { name: "Pressure", description: function(e2) {
          return e2[0] / e2[1] + " hPa";
        } }, 37891: { name: "WaterDepth", description: function(e2) {
          return e2[0] / e2[1] + " m";
        } }, 37892: { name: "Acceleration", description: function(e2) {
          return e2[0] / e2[1] + " mGal";
        } }, 37893: { name: "CameraElevationAngle", description: function(e2) {
          return e2[0] / e2[1] + " \xB0";
        } }, 40960: { name: "FlashpixVersion", description: function(e2) {
          return e2.map(function(e3) {
            return String.fromCharCode(e3);
          }).join("");
        } }, 40961: { name: "ColorSpace", description: nt.ColorSpace }, 40962: "PixelXDimension", 40963: "PixelYDimension", 40964: "RelatedSoundFile", 40965: "Interoperability IFD Pointer", 41483: "FlashEnergy", 41484: { name: "SpatialFrequencyResponse", description: function() {
          return "[Raw SFR table data]";
        } }, 41486: "FocalPlaneXResolution", 41487: "FocalPlaneYResolution", 41488: { name: "FocalPlaneResolutionUnit", description: nt.FocalPlaneResolutionUnit }, 41492: { name: "SubjectLocation", description: function(e2) {
          var t2, n2 = function(e3) {
            if (Array.isArray(e3)) return e3;
          }(t2 = e2) || function(e3) {
            var t3 = null == e3 ? null : "undefined" != typeof Symbol && e3[Symbol.iterator] || e3["@@iterator"];
            if (null != t3) {
              var n3, r3, i3, o2, a2 = [], u2 = 1, c2 = 0;
              try {
                for (i3 = (t3 = t3.call(e3)).next, false; !(u2 = (n3 = i3.call(t3)).done) && (a2.push(n3.value), 2 !== a2.length); u2 = 1) ;
              } catch (e4) {
                c2 = 1, r3 = e4;
              } finally {
                try {
                  if (!u2 && null != t3.return && (o2 = t3.return(), Object(o2) !== o2)) return;
                } finally {
                  if (c2) throw r3;
                }
              }
              return a2;
            }
          }(t2) || function(e3) {
            if (e3) {
              if ("string" == typeof e3) return ot(e3, 2);
              var t3 = {}.toString.call(e3).slice(8, -1);
              return "Object" === t3 && e3.constructor && (t3 = e3.constructor.name), "Map" === t3 || "Set" === t3 ? Array.from(e3) : "Arguments" === t3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t3) ? ot(e3, 2) : void 0;
            }
          }(t2) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }(), r2 = n2[0], i2 = n2[1];
          return "X: ".concat(r2, ", Y: ").concat(i2);
        } }, 41493: "ExposureIndex", 41495: { name: "SensingMethod", description: function(e2) {
          return 1 === e2 ? "Undefined" : 2 === e2 ? "One-chip color area sensor" : 3 === e2 ? "Two-chip color area sensor" : 4 === e2 ? "Three-chip color area sensor" : 5 === e2 ? "Color sequential area sensor" : 7 === e2 ? "Trilinear sensor" : 8 === e2 ? "Color sequential linear sensor" : "Unknown";
        } }, 41728: { name: "FileSource", description: function(e2) {
          return 3 === e2 ? "DSC" : "Unknown";
        } }, 41729: { name: "SceneType", description: function(e2) {
          return 1 === e2 ? "A directly photographed image" : "Unknown";
        } }, 41730: { name: "CFAPattern", description: function() {
          return "[Raw CFA pattern table data]";
        } }, 41985: { name: "CustomRendered", description: nt.CustomRendered }, 41986: { name: "ExposureMode", description: nt.ExposureMode }, 41987: { name: "WhiteBalance", description: nt.WhiteBalance }, 41988: { name: "DigitalZoomRatio", description: function(e2) {
          return 0 === e2[0] ? "Digital zoom was not used" : "" + e2[0] / e2[1];
        } }, 41989: { name: "FocalLengthIn35mmFilm", description: function(e2) {
          return 0 === e2 ? "Unknown" : e2 + " mm";
        } }, 41990: { name: "SceneCaptureType", description: nt.SceneCaptureType }, 41991: { name: "GainControl", description: function(e2) {
          return 0 === e2 ? "None" : 1 === e2 ? "Low gain up" : 2 === e2 ? "High gain up" : 3 === e2 ? "Low gain down" : 4 === e2 ? "High gain down" : "Unknown";
        } }, 41992: { name: "Contrast", description: nt.Contrast }, 41993: { name: "Saturation", description: nt.Saturation }, 41994: { name: "Sharpness", description: nt.Sharpness }, 41995: { name: "DeviceSettingDescription", description: function() {
          return "[Raw device settings table data]";
        } }, 41996: { name: "SubjectDistanceRange", description: function(e2) {
          return 1 === e2 ? "Macro" : 2 === e2 ? "Close view" : 3 === e2 ? "Distant view" : "Unknown";
        } }, 42016: "ImageUniqueID", 42032: "CameraOwnerName", 42033: "BodySerialNumber", 42034: { name: "LensSpecification", description: function(e2) {
          var t2 = parseFloat((e2[0][0] / e2[0][1]).toFixed(5)), n2 = parseFloat((e2[1][0] / e2[1][1]).toFixed(5)), r2 = "".concat(t2, "-").concat(n2, " mm");
          if (0 === e2[3][1]) return "".concat(r2, " f/?");
          var i2 = 1 / (e2[2][1] / e2[2][1] / (e2[3][0] / e2[3][1]));
          return "".concat(r2, " f/").concat(parseFloat(i2.toFixed(5)));
        } }, 42035: "LensMake", 42036: "LensModel", 42037: "LensSerialNumber", 42080: { name: "CompositeImage", description: function(e2) {
          return { 1: "Not a Composite Image", 2: "General Composite Image", 3: "Composite Image Captured While Shooting" }[e2] || "Unknown";
        } }, 42081: "SourceImageNumberOfCompositeImage", 42082: "SourceExposureTimesOfCompositeImage", 42240: "Gamma", 59932: "Padding", 59933: "OffsetSchema", 65e3: "OwnerName", 65001: "SerialNumber", 65002: "Lens", 65100: "RawFile", 65101: "Converter", 65102: "WhiteBalance", 65105: "Exposure", 65106: "Shadows", 65107: "Brightness", 65108: "Contrast", 65109: "Saturation", 65110: "Sharpness", 65111: "Smoothness", 65112: "MoireFilter" }), pt = "0th", mt = "exif", gt = "interoperability", vt = "canon", ht = "pentax", yt = lt(lt(lt(lt(lt(lt(lt(lt({}, pt, dt), "1st", rt), mt, dt), "gps", ut), gt, ct), "mpf", h.USE_MPF ? ft : {}), vt, h.USE_MAKER_NOTES ? { 4: { name: "ShotInfo", description: function(e2) {
          return e2;
        } } } : {}), ht, h.USE_MAKER_NOTES ? { 0: { name: "PentaxVersion", description: function(e2) {
          return e2.join(".");
        } }, 5: "PentaxModelID", 555: "LevelInfo" } : {}), St = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8, 13: 4 }, bt = { BYTE: 1, ASCII: 2, SHORT: 3, LONG: 4, RATIONAL: 5, UNDEFINED: 7, SLONG: 9, SRATIONAL: 10, IFD: 13 }, It = { getAsciiValue: function(e2) {
          return e2.map(function(e3) {
            return String.fromCharCode(e3);
          });
        }, getByteAt: Ct, getAsciiAt: function(e2, t2) {
          return e2.getUint8(t2);
        }, getShortAt: function(e2, t2, n2) {
          return e2.getUint16(t2, n2 === C);
        }, getLongAt: Ut, getRationalAt: function(e2, t2, n2) {
          return [Ut(e2, t2, n2), Ut(e2, t2 + 4, n2)];
        }, getUndefinedAt: function(e2, t2) {
          return Ct(e2, t2);
        }, getSlongAt: Pt, getSrationalAt: function(e2, t2, n2) {
          return [Pt(e2, t2, n2), Pt(e2, t2 + 4, n2)];
        }, getIfdPointerAt: function(e2, t2, n2) {
          return Ut(e2, t2, n2);
        }, typeSizes: St, tagTypes: bt, getTypeSize: function(e2) {
          if (void 0 === bt[e2]) throw Error("No such type found.");
          return St[bt[e2]];
        } };
        function Ct(e2, t2) {
          return e2.getUint8(t2);
        }
        function Ut(e2, t2, n2) {
          return e2.getUint32(t2, n2 === C);
        }
        function Pt(e2, t2, n2) {
          return e2.getInt32(t2, n2 === C);
        }
        var At = { 1: It.getByteAt, 2: It.getAsciiAt, 3: It.getShortAt, 4: It.getLongAt, 5: It.getRationalAt, 7: It.getUndefinedAt, 9: It.getSlongAt, 10: It.getSrationalAt, 13: It.getIfdPointerAt };
        function Et(e2, t2, n2) {
          return t2 + It.getLongAt(e2, t2 + 4, n2);
        }
        function wt(e2, t2, n2, r2, i2, o2) {
          var a2 = It.getTypeSize("SHORT"), u2 = {}, c2 = function(e3, t3, n3) {
            return t3 + It.getTypeSize("SHORT") <= e3.byteLength ? It.getShortAt(e3, t3, n3) : 0;
          }(e2, r2, i2);
          r2 += a2;
          for (var f2 = 0; f2 < c2 && !(r2 + 12 > e2.byteLength); f2++) {
            var s2 = xt(e2, t2, n2, r2, i2, o2);
            void 0 !== s2 && (u2[s2.name] = { id: s2.id, value: s2.value, description: s2.description }, ("MakerNote" === s2.name || t2 === ht && "LevelInfo" === s2.name) && (u2[s2.name].__offset = s2.__offset)), r2 += 12;
          }
          if (h.USE_THUMBNAIL && r2 < e2.byteLength - It.getTypeSize("LONG")) {
            var l2 = It.getLongAt(e2, r2, i2);
            0 !== l2 && t2 === pt && (u2.Thumbnail = wt(e2, "1st", n2, n2 + l2, i2, o2));
          }
          return u2;
        }
        function xt(e2, t2, n2, r2, i2, o2) {
          var a2, u2, c2 = It.getTypeSize("SHORT"), f2 = c2 + It.getTypeSize("SHORT"), s2 = f2 + It.getTypeSize("LONG"), l2 = It.getShortAt(e2, r2, i2), d2 = It.getShortAt(e2, r2 + c2, i2), p2 = It.getLongAt(e2, r2 + f2, i2);
          if (void 0 !== It.typeSizes[d2] && (o2 || void 0 !== yt[t2][l2])) {
            a2 = function(e3, t3) {
              return It.typeSizes[e3] * t3 <= It.getTypeSize("LONG");
            }(d2, p2) ? Tt(e2, u2 = r2 + s2, d2, p2, i2) : function(e3, t3, n3, r3, i3) {
              return t3 + n3 + It.typeSizes[r3] * i3 <= e3.byteLength;
            }(e2, n2, u2 = It.getLongAt(e2, r2 + s2, i2), d2, p2) ? Tt(e2, n2 + u2, d2, p2, i2, 33723 === l2) : "<faulty value>", d2 === It.tagTypes.ASCII && (a2 = function(e3) {
              try {
                return e3.map(function(e4) {
                  return decodeURIComponent(escape(e4));
                });
              } catch (t3) {
                return e3;
              }
            }(a2 = function(e3) {
              for (var t3 = [], n3 = 0, r3 = 0; r3 < e3.length; r3++) "\0" !== e3[r3] ? (void 0 === t3[n3] && (t3[n3] = ""), t3[n3] += e3[r3]) : n3++;
              return t3;
            }(a2)));
            var m2 = "undefined-".concat(l2), g2 = a2;
            if (void 0 !== yt[t2][l2]) if (void 0 !== yt[t2][l2].name && void 0 !== yt[t2][l2].description) {
              m2 = yt[t2][l2].name;
              try {
                g2 = yt[t2][l2].description(a2);
              } catch (e3) {
                g2 = Ot(a2);
              }
            } else d2 === It.tagTypes.RATIONAL || d2 === It.tagTypes.SRATIONAL ? (m2 = yt[t2][l2], g2 = "" + a2[0] / a2[1]) : (m2 = yt[t2][l2], g2 = Ot(a2));
            return { id: l2, name: m2, value: a2, description: g2, __offset: u2 };
          }
        }
        function Tt(e2, t2, n2, r2, i2) {
          var o2 = [];
          arguments.length > 5 && void 0 !== arguments[5] && arguments[5] && (r2 *= It.typeSizes[n2], n2 = It.tagTypes.BYTE);
          for (var a2 = 0; a2 < r2; a2++) o2.push(At[n2](e2, t2, i2)), t2 += It.typeSizes[n2];
          return n2 === It.tagTypes.ASCII ? o2 = It.getAsciiValue(o2) : 1 === o2.length && (o2 = o2[0]), o2;
        }
        function Ot(e2) {
          return e2 instanceof Array ? e2.join(", ") : e2;
        }
        var Mt = "Exif IFD Pointer", Ft = "GPS Info IFD Pointer", Rt = "Interoperability IFD Pointer", kt = { read: function(e2, t2, n2) {
          var r2 = U(e2, t2), i2 = function(e3, t3, n3, r3) {
            return wt(e3, pt, t3, Et(e3, t3, n3), n3, r3);
          }(e2, t2, r2, n2);
          return { tags: i2 = Lt(i2 = Nt(i2 = Dt(i2, e2, t2, r2, n2), e2, t2, r2, n2), e2, t2, r2, n2), byteOrder: r2 };
        } };
        function Dt(e2, t2, n2, r2, i2) {
          return void 0 !== e2[Mt] ? l(e2, wt(t2, mt, n2, n2 + e2[Mt].value, r2, i2)) : e2;
        }
        function Nt(e2, t2, n2, r2, i2) {
          return void 0 !== e2[Ft] ? l(e2, wt(t2, "gps", n2, n2 + e2[Ft].value, r2, i2)) : e2;
        }
        function Lt(e2, t2, n2, r2, i2) {
          return void 0 !== e2[Rt] ? l(e2, wt(t2, gt, n2, n2 + e2[Rt].value, r2, i2)) : e2;
        }
        var _t = { read: function(e2, t2, n2) {
          var r2 = U(e2, t2);
          return function(e3, t3, n3, r3) {
            if (!n3.MPEntry) return n3;
            for (var i2 = [], o2 = 0; o2 < Math.ceil(n3.MPEntry.value.length / Bt); o2++) {
              i2[o2] = {};
              var a2 = Gt(n3.MPEntry.value, o2 * Bt, It.getTypeSize("LONG"), r3);
              i2[o2].ImageFlags = jt(a2), i2[o2].ImageFormat = zt(a2), i2[o2].ImageType = Vt(a2);
              var u2 = Gt(n3.MPEntry.value, o2 * Bt + 4, It.getTypeSize("LONG"), r3);
              i2[o2].ImageSize = { value: u2, description: "" + u2 };
              var c2 = Ht(o2, n3.MPEntry, r3, t3);
              i2[o2].ImageOffset = { value: c2, description: "" + c2 };
              var f2 = Gt(n3.MPEntry.value, o2 * Bt + 12, It.getTypeSize("SHORT"), r3);
              i2[o2].DependentImage1EntryNumber = { value: f2, description: "" + f2 };
              var s2 = Gt(n3.MPEntry.value, o2 * Bt + 14, It.getTypeSize("SHORT"), r3);
              i2[o2].DependentImage2EntryNumber = { value: s2, description: "" + s2 }, i2[o2].image = e3.buffer.slice(c2, c2 + u2), d(i2[o2], "base64", function() {
                return p(this.image);
              });
            }
            return n3.Images = i2, n3;
          }(e2, t2, wt(e2, "mpf", t2, Et(e2, t2, r2), r2, n2), r2);
        } }, Bt = 16;
        function Gt(e2, t2, n2, r2) {
          if (r2 === C) {
            for (var i2 = 0, o2 = 0; o2 < n2; o2++) i2 += e2[t2 + o2] << 8 * o2;
            return i2;
          }
          for (var a2 = 0, u2 = 0; u2 < n2; u2++) a2 += e2[t2 + u2] << 8 * (n2 - 1 - u2);
          return a2;
        }
        function jt(e2) {
          var t2 = [e2 >> 31 & 1, e2 >> 30 & 1, e2 >> 29 & 1], n2 = [];
          return t2[0] && n2.push("Dependent Parent Image"), t2[1] && n2.push("Dependent Child Image"), t2[2] && n2.push("Representative Image"), { value: t2, description: n2.join(", ") || "None" };
        }
        function zt(e2) {
          var t2 = e2 >> 24 & 7;
          return { value: t2, description: 0 === t2 ? "JPEG" : "Unknown" };
        }
        function Vt(e2) {
          var t2 = 16777215 & e2;
          return { value: t2, description: { 196608: "Baseline MP Primary Image", 65537: "Large Thumbnail (VGA equivalent)", 65538: "Large Thumbnail (Full HD equivalent)", 131073: "Multi-Frame Image (Panorama)", 131074: "Multi-Frame Image (Disparity)", 131075: "Multi-Frame Image (Multi-Angle)", 0: "Undefined" }[t2] || "Unknown" };
        }
        function Ht(e2, t2, n2, r2) {
          return /* @__PURE__ */ function(e3) {
            return 0 === e3;
          }(e2) ? 0 : Gt(t2.value, e2 * Bt + 8, It.getTypeSize("LONG"), n2) + r2;
        }
        var Wt = { read: function(e2, t2) {
          var n2 = function(e3, t3) {
            return It.getShortAt(e3, t3);
          }(e2, t2), r2 = function(e3, t3, n3) {
            if (!(8 > n3)) {
              var r3 = It.getByteAt(e3, t3 + 7);
              return { value: r3, description: "" + r3 };
            }
          }(e2, t2, n2);
          return { "Bits Per Sample": Xt(e2, t2, n2), "Image Height": Jt(e2, t2, n2), "Image Width": Yt(e2, t2, n2), "Color Components": r2, Subsampling: r2 && Kt(e2, t2, r2.value, n2) };
        } };
        function Xt(e2, t2, n2) {
          if (!(3 > n2)) {
            var r2 = It.getByteAt(e2, t2 + 2);
            return { value: r2, description: "" + r2 };
          }
        }
        function Jt(e2, t2, n2) {
          if (!(5 > n2)) {
            var r2 = It.getShortAt(e2, t2 + 3);
            return { value: r2, description: "".concat(r2, "px") };
          }
        }
        function Yt(e2, t2, n2) {
          if (!(7 > n2)) {
            var r2 = It.getShortAt(e2, t2 + 5);
            return { value: r2, description: "".concat(r2, "px") };
          }
        }
        function Kt(e2, t2, n2, r2) {
          if (!(8 + 3 * n2 > r2)) {
            for (var i2 = [], o2 = 0; o2 < n2; o2++) {
              var a2 = t2 + 8 + 3 * o2;
              i2.push([It.getByteAt(e2, a2), It.getByteAt(e2, a2 + 1), It.getByteAt(e2, a2 + 2)]);
            }
            return { value: i2, description: i2.length > 1 ? qt(i2) + $t(i2) : "" };
          }
        }
        function qt(e2) {
          var t2 = { 1: "Y", 2: "Cb", 3: "Cr", 4: "I", 5: "Q" };
          return e2.map(function(e3) {
            return t2[e3[0]];
          }).join("");
        }
        function $t(e2) {
          var t2 = { 17: "4:4:4 (1 1)", 18: "4:4:0 (1 2)", 20: "4:4:1 (1 4)", 33: "4:2:2 (2 1)", 34: "4:2:0 (2 2)", 36: "4:2:1 (2 4)", 65: "4:1:1 (4 1)", 66: "4:1:0 (4 2)" };
          return 0 === e2.length || void 0 === e2[0][1] || void 0 === t2[e2[0][1]] ? "" : t2[e2[0][1]];
        }
        var Zt = { read: function(e2, t2) {
          var n2 = function(e3, t3) {
            return It.getShortAt(e3, t3);
          }(e2, t2), r2 = function(e3, t3, n3) {
            if (!(15 > n3)) {
              var r3 = It.getByteAt(e3, t3 + 14);
              return { value: r3, description: "".concat(r3, "px") };
            }
          }(e2, t2, n2), i2 = function(e3, t3, n3) {
            if (!(16 > n3)) {
              var r3 = It.getByteAt(e3, t3 + 15);
              return { value: r3, description: "".concat(r3, "px") };
            }
          }(e2, t2, n2), o2 = { "JFIF Version": Qt(e2, t2, n2), "Resolution Unit": en(e2, t2, n2), XResolution: nn(e2, t2, n2), YResolution: rn(e2, t2, n2), "JFIF Thumbnail Width": r2, "JFIF Thumbnail Height": i2 };
          if (void 0 !== r2 && void 0 !== i2) {
            var a2 = function(e3, t3, n3, r3) {
              if (!(0 === n3 || 16 + n3 > r3)) return { value: e3.buffer.slice(t3 + 16, t3 + 16 + n3), description: "<24-bit RGB pixel data>" };
            }(e2, t2, 3 * r2.value * i2.value, n2);
            a2 && (o2["JFIF Thumbnail"] = a2);
          }
          for (var u2 in o2) void 0 === o2[u2] && delete o2[u2];
          return o2;
        } };
        function Qt(e2, t2, n2) {
          if (!(9 > n2)) {
            var r2 = It.getByteAt(e2, t2 + 7), i2 = It.getByteAt(e2, t2 + 7 + 1);
            return { value: 256 * r2 + i2, description: r2 + "." + i2 };
          }
        }
        function en(e2, t2, n2) {
          if (!(10 > n2)) {
            var r2 = It.getByteAt(e2, t2 + 9);
            return { value: r2, description: tn(r2) };
          }
        }
        function tn(e2) {
          return 0 === e2 ? "None" : 1 === e2 ? "inches" : 2 === e2 ? "cm" : "Unknown";
        }
        function nn(e2, t2, n2) {
          if (!(12 > n2)) {
            var r2 = It.getShortAt(e2, t2 + 10);
            return { value: r2, description: "" + r2 };
          }
        }
        function rn(e2, t2, n2) {
          if (!(14 > n2)) {
            var r2 = It.getShortAt(e2, t2 + 12);
            return { value: r2, description: "" + r2 };
          }
        }
        var on = { iptc: { 256: { name: "Model Version", description: function(e2) {
          return "" + ((e2[0] << 8) + e2[1]);
        } }, 261: { name: "Destination", repeatable: 1 }, 276: { name: "File Format", description: function(e2) {
          return "" + ((e2[0] << 8) + e2[1]);
        } }, 278: { name: "File Format Version", description: function(e2) {
          return "" + ((e2[0] << 8) + e2[1]);
        } }, 286: "Service Identifier", 296: "Envelope Number", 306: "Product ID", 316: "Envelope Priority", 326: { name: "Date Sent", description: an }, 336: { name: "Time Sent", description: un }, 346: { name: "Coded Character Set", description: cn, encoding_name: cn }, 356: "UNO", 376: { name: "ARM Identifier", description: function(e2) {
          return "" + ((e2[0] << 8) + e2[1]);
        } }, 378: { name: "ARM Version", description: function(e2) {
          return "" + ((e2[0] << 8) + e2[1]);
        } }, 512: { name: "Record Version", description: function(e2) {
          return "" + ((e2[0] << 8) + e2[1]);
        } }, 515: "Object Type Reference", 516: "Object Attribute Reference", 517: "Object Name", 519: "Edit Status", 520: { name: "Editorial Update", description: function(e2) {
          return "01" === y(e2) ? "Additional Language" : "Unknown";
        } }, 522: "Urgency", 524: { name: "Subject Reference", repeatable: 1, description: function(e2) {
          var t2 = y(e2).split(":");
          return t2[2] + (t2[3] ? "/" + t2[3] : "") + (t2[4] ? "/" + t2[4] : "");
        } }, 527: "Category", 532: { name: "Supplemental Category", repeatable: 1 }, 534: "Fixture Identifier", 537: { name: "Keywords", repeatable: 1 }, 538: { name: "Content Location Code", repeatable: 1 }, 539: { name: "Content Location Name", repeatable: 1 }, 542: "Release Date", 547: "Release Time", 549: "Expiration Date", 550: "Expiration Time", 552: "Special Instructions", 554: { name: "Action Advised", description: function(e2) {
          var t2 = y(e2);
          return "01" === t2 ? "Object Kill" : "02" === t2 ? "Object Replace" : "03" === t2 ? "Object Append" : "04" === t2 ? "Object Reference" : "Unknown";
        } }, 557: { name: "Reference Service", repeatable: 1 }, 559: { name: "Reference Date", repeatable: 1 }, 562: { name: "Reference Number", repeatable: 1 }, 567: { name: "Date Created", description: an }, 572: { name: "Time Created", description: un }, 574: { name: "Digital Creation Date", description: an }, 575: { name: "Digital Creation Time", description: un }, 577: "Originating Program", 582: "Program Version", 587: { name: "Object Cycle", description: function(e2) {
          var t2 = y(e2);
          return "a" === t2 ? "morning" : "p" === t2 ? "evening" : "b" === t2 ? "both" : "Unknown";
        } }, 592: { name: "By-line", repeatable: 1 }, 597: { name: "By-line Title", repeatable: 1 }, 602: "City", 604: "Sub-location", 607: "Province/State", 612: "Country/Primary Location Code", 613: "Country/Primary Location Name", 615: "Original Transmission Reference", 617: "Headline", 622: "Credit", 627: "Source", 628: "Copyright Notice", 630: { name: "Contact", repeatable: 1 }, 632: "Caption/Abstract", 634: { name: "Writer/Editor", repeatable: 1 }, 637: { name: "Rasterized Caption", description: function(e2) {
          return e2;
        } }, 642: "Image Type", 643: { name: "Image Orientation", description: function(e2) {
          var t2 = y(e2);
          return "P" === t2 ? "Portrait" : "L" === t2 ? "Landscape" : "S" === t2 ? "Square" : "Unknown";
        } }, 647: "Language Identifier", 662: { name: "Audio Type", description: function(e2) {
          var t2 = y(e2), n2 = t2.charAt(0), r2 = t2.charAt(1), i2 = "";
          return "1" === n2 ? i2 += "Mono" : "2" === n2 && (i2 += "Stereo"), "A" === r2 ? i2 += ", actuality" : "C" === r2 ? i2 += ", question and answer session" : "M" === r2 ? i2 += ", music, transmitted by itself" : "Q" === r2 ? i2 += ", response to a question" : "R" === r2 ? i2 += ", raw sound" : "S" === r2 ? i2 += ", scener" : "V" === r2 ? i2 += ", voicer" : "W" === r2 && (i2 += ", wrap"), "" !== i2 ? i2 : t2;
        } }, 663: { name: "Audio Sampling Rate", description: function(e2) {
          return parseInt(y(e2), 10) + " Hz";
        } }, 664: { name: "Audio Sampling Resolution", description: function(e2) {
          var t2 = parseInt(y(e2), 10);
          return t2 + (1 === t2 ? " bit" : " bits");
        } }, 665: { name: "Audio Duration", description: function(e2) {
          var t2 = y(e2);
          return t2.length >= 6 ? t2.substr(0, 2) + ":" + t2.substr(2, 2) + ":" + t2.substr(4, 2) : t2;
        } }, 666: "Audio Outcue", 698: "Short Document ID", 699: "Unique Document ID", 700: "Owner ID", 712: { name: function(e2) {
          return 2 === e2.length ? "ObjectData Preview File Format" : "Record 2 destination";
        }, description: function(e2) {
          if (2 === e2.length) {
            var t2 = (e2[0] << 8) + e2[1];
            return 0 === t2 ? "No ObjectData" : 1 === t2 ? "IPTC-NAA Digital Newsphoto Parameter Record" : 2 === t2 ? "IPTC7901 Recommended Message Format" : 3 === t2 ? "Tagged Image File Format (Adobe/Aldus Image data)" : 4 === t2 ? "Illustrator (Adobe Graphics data)" : 5 === t2 ? "AppleSingle (Apple Computer Inc)" : 6 === t2 ? "NAA 89-3 (ANPA 1312)" : 7 === t2 ? "MacBinary II" : 8 === t2 ? "IPTC Unstructured Character Oriented File Format (UCOFF)" : 9 === t2 ? "United Press International ANPA 1312 variant" : 10 === t2 ? "United Press International Down-Load Message" : 11 === t2 ? "JPEG File Interchange (JFIF)" : 12 === t2 ? "Photo-CD Image-Pac (Eastman Kodak)" : 13 === t2 ? "Microsoft Bit Mapped Graphics File [*.BMP]" : 14 === t2 ? "Digital Audio File [*.WAV] (Microsoft & Creative Labs)" : 15 === t2 ? "Audio plus Moving Video [*.AVI] (Microsoft)" : 16 === t2 ? "PC DOS/Windows Executable Files [*.COM][*.EXE]" : 17 === t2 ? "Compressed Binary File [*.ZIP] (PKWare Inc)" : 18 === t2 ? "Audio Interchange File Format AIFF (Apple Computer Inc)" : 19 === t2 ? "RIFF Wave (Microsoft Corporation)" : 20 === t2 ? "Freehand (Macromedia/Aldus)" : 21 === t2 ? 'Hypertext Markup Language "HTML" (The Internet Society)' : 22 === t2 ? "MPEG 2 Audio Layer 2 (Musicom), ISO/IEC" : 23 === t2 ? "MPEG 2 Audio Layer 3, ISO/IEC" : 24 === t2 ? "Portable Document File (*.PDF) Adobe" : 25 === t2 ? "News Industry Text Format (NITF)" : 26 === t2 ? "Tape Archive (*.TAR)" : 27 === t2 ? "Tidningarnas Telegrambyr\xE5 NITF version (TTNITF DTD)" : 28 === t2 ? "Ritzaus Bureau NITF version (RBNITF DTD)" : 29 === t2 ? "Corel Draw [*.CDR]" : "Unknown format ".concat(t2);
          }
          return y(e2);
        } }, 713: { name: "ObjectData Preview File Format Version", description: function(e2, t2) {
          var n2 = { "00": { "00": "1" }, "01": { "01": "1", "02": "2", "03": "3", "04": "4" }, "02": { "04": "4" }, "03": { "01": "5.0", "02": "6.0" }, "04": { "01": "1.40" }, "05": { "01": "2" }, "06": { "01": "1" }, 11: { "01": "1.02" }, 20: { "01": "3.1", "02": "4.0", "03": "5.0", "04": "5.5" }, 21: { "02": "2.0" } }, r2 = y(e2);
          if (t2["ObjectData Preview File Format"]) {
            var i2 = y(t2["ObjectData Preview File Format"].value);
            if (n2[i2] && n2[i2][r2]) return n2[i2][r2];
          }
          return r2;
        } }, 714: "ObjectData Preview Data", 1802: { name: "Size Mode", description: function(e2) {
          return e2[0].toString();
        } }, 1812: { name: "Max Subfile Size", description: function(e2) {
          for (var t2 = 0, n2 = 0; n2 < e2.length; n2++) t2 = (t2 << 8) + e2[n2];
          return t2.toString();
        } }, 1882: { name: "ObjectData Size Announced", description: function(e2) {
          for (var t2 = 0, n2 = 0; n2 < e2.length; n2++) t2 = (t2 << 8) + e2[n2];
          return t2.toString();
        } }, 1887: { name: "Maximum ObjectData Size", description: function(e2) {
          for (var t2 = 0, n2 = 0; n2 < e2.length; n2++) t2 = (t2 << 8) + e2[n2];
          return t2.toString();
        } } } };
        function an(e2) {
          var t2 = y(e2);
          return t2.length >= 8 ? t2.substr(0, 4) + "-" + t2.substr(4, 2) + "-" + t2.substr(6, 2) : t2;
        }
        function un(e2) {
          var t2 = y(e2), n2 = t2;
          return t2.length >= 6 && (n2 = t2.substr(0, 2) + ":" + t2.substr(2, 2) + ":" + t2.substr(4, 2), 11 === t2.length && (n2 += t2.substr(6, 1) + t2.substr(7, 2) + ":" + t2.substr(9, 2))), n2;
        }
        function cn(e2) {
          var t2 = y(e2);
          return "\x1B%G" === t2 ? "UTF-8" : "\x1B%5" === t2 ? "Windows-1252" : "\x1B%/G" === t2 ? "UTF-8 Level 1" : "\x1B%/H" === t2 ? "UTF-8 Level 2" : "\x1B%/I" === t2 ? "UTF-8 Level 3" : "\x1B/A" === t2 ? "ISO-8859-1" : "\x1B/B" === t2 ? "ISO-8859-2" : "\x1B/C" === t2 ? "ISO-8859-3" : "\x1B/D" === t2 ? "ISO-8859-4" : "\x1B/@" === t2 ? "ISO-8859-5" : "\x1B/G" === t2 ? "ISO-8859-6" : "\x1B/F" === t2 ? "ISO-8859-7" : "\x1B/H" === t2 ? "ISO-8859-8" : "Unknown";
        }
        var fn = function(e2, t2) {
          var n2 = function() {
            if ("undefined" != typeof TextDecoder) return TextDecoder;
          }();
          if ("undefined" != typeof n2 && void 0 !== e2) try {
            return new n2(e2).decode(t2 instanceof DataView ? t2.buffer : Uint8Array.from(t2));
          } catch (e3) {
          }
          return function(e3) {
            try {
              return decodeURIComponent(escape(e3));
            } catch (t3) {
              return e3;
            }
          }(t2.map(function(e3) {
            return String.fromCharCode(e3);
          }).join(""));
        }, sn = { read: function(e2, t2, n2) {
          try {
            if (Array.isArray(e2)) return mn(new DataView(Uint8Array.from(e2).buffer), { size: e2.length }, 0, n2);
            var r2 = function(e3, t3) {
              for (; t3 + 12 <= e3.byteLength; ) {
                var n3 = ln(e3, t3);
                if (dn(n3)) return { naaBlock: n3, dataOffset: t3 + n3.headerSize };
                t3 += n3.headerSize + n3.size + pn(n3);
              }
              throw Error("No IPTC NAA resource block.");
            }(e2, t2);
            return mn(e2, r2.naaBlock, r2.dataOffset, n2);
          } catch (e3) {
            return {};
          }
        } };
        function ln(e2, t2) {
          if (943868237 !== e2.getUint32(t2, 0)) throw Error("Not an IPTC resource block.");
          var n2 = e2.getUint8(t2 + 4 + 2), r2 = (n2 % 2 == 0 ? n2 + 1 : n2) + 1;
          return { headerSize: 6 + r2 + 4, type: e2.getUint16(t2 + 4), size: e2.getUint32(t2 + 4 + 2 + r2) };
        }
        function dn(e2) {
          return 1028 === e2.type;
        }
        function pn(e2) {
          return e2.size % 2 != 0 ? 1 : 0;
        }
        function mn(e2, t2, n2, r2) {
          for (var i2 = {}, o2 = void 0, a2 = n2 + t2.size; n2 < a2 && n2 < e2.byteLength; ) {
            var u2 = gn(e2, n2, i2, o2, r2), c2 = u2.tag, f2 = u2.tagSize;
            if (null === c2) break;
            c2 && ("encoding" in c2 && (o2 = c2.encoding), void 0 === i2[c2.name] || void 0 === c2.repeatable ? i2[c2.name] = { id: c2.id, value: c2.value, description: c2.description } : (i2[c2.name] instanceof Array || (i2[c2.name] = [{ id: i2[c2.name].id, value: i2[c2.name].value, description: i2[c2.name].description }]), i2[c2.name].push({ id: c2.id, value: c2.value, description: c2.description }))), n2 += 5 + f2;
          }
          return i2;
        }
        function gn(e2, t2, n2, r2, i2) {
          if (function(e3, t3) {
            return 28 !== e3.getUint8(t3);
          }(e2, t2)) return { tag: null, tagSize: 0 };
          var o2 = e2.getUint16(t2 + 1), a2 = e2.getUint16(t2 + 3);
          if (!i2 && !on.iptc[o2]) return { tag: void 0, tagSize: a2 };
          var u2 = function(e3, t3, n3) {
            for (var r3 = [], i3 = 0; i3 < n3; i3++) r3.push(e3.getUint8(t3 + i3));
            return r3;
          }(e2, t2 + 5, a2), c2 = { id: o2, name: vn(on.iptc[o2], o2, u2), value: u2, description: hn(on.iptc[o2], u2, n2, r2) };
          return function(e3) {
            return on.iptc[e3] && on.iptc[e3].repeatable;
          }(o2) && (c2.repeatable = 1), function(e3) {
            return on.iptc[e3] && void 0 !== on.iptc[e3].encoding_name;
          }(o2) && (c2.encoding = on.iptc[o2].encoding_name(u2)), { tag: c2, tagSize: a2 };
        }
        function vn(e2, t2, n2) {
          return e2 ? /* @__PURE__ */ function(e3) {
            return "string" == typeof e3;
          }(e2) ? e2 : function(e3) {
            return "function" == typeof e3.name;
          }(e2) ? e2.name(n2) : e2.name : "undefined-".concat(t2);
        }
        function hn(e2, t2, n2, r2) {
          if (function(e3) {
            return e3 && void 0 !== e3.description;
          }(e2)) try {
            return e2.description(t2, n2);
          } catch (e3) {
          }
          return function(e3, t3) {
            return e3 && t3 instanceof Array;
          }(e2, t2) ? fn(r2, t2) : t2;
        }
        function yn(e2, t2) {
          (null == t2 || t2 > e2.length) && (t2 = e2.length);
          for (var n2 = 0, r2 = Array(t2); n2 < t2; n2++) r2[n2] = e2[n2];
          return r2;
        }
        var Sn = { "tiff:Orientation": function(e2) {
          return "1" === e2 ? "Horizontal (normal)" : "2" === e2 ? "Mirror horizontal" : "3" === e2 ? "Rotate 180" : "4" === e2 ? "Mirror vertical" : "5" === e2 ? "Mirror horizontal and rotate 270 CW" : "6" === e2 ? "Rotate 90 CW" : "7" === e2 ? "Mirror horizontal and rotate 90 CW" : "8" === e2 ? "Rotate 270 CW" : e2;
        }, "tiff:ResolutionUnit": function(e2) {
          return nt.ResolutionUnit(parseInt(e2, 10));
        }, "tiff:XResolution": function(e2) {
          return bn(nt.XResolution, e2);
        }, "tiff:YResolution": function(e2) {
          return bn(nt.YResolution, e2);
        }, "exif:ApertureValue": function(e2) {
          return bn(nt.ApertureValue, e2);
        }, "exif:GPSLatitude": Cn, "exif:GPSLongitude": Cn, "exif:FNumber": function(e2) {
          return bn(nt.FNumber, e2);
        }, "exif:FocalLength": function(e2) {
          return bn(nt.FocalLength, e2);
        }, "exif:FocalPlaneResolutionUnit": function(e2) {
          return nt.FocalPlaneResolutionUnit(parseInt(e2, 10));
        }, "exif:ColorSpace": function(e2) {
          return nt.ColorSpace(function(e3) {
            return "0x" === e3.substring(0, 2) ? parseInt(e3.substring(2), 16) : parseInt(e3, 10);
          }(e2));
        }, "exif:ComponentsConfiguration": function(e2, t2) {
          if (/^\d, \d, \d, \d$/.test(t2)) {
            var n2 = t2.split(", ").map(function(e3) {
              return e3.charCodeAt(0);
            });
            return nt.ComponentsConfiguration(n2);
          }
          return t2;
        }, "exif:Contrast": function(e2) {
          return nt.Contrast(parseInt(e2, 10));
        }, "exif:CustomRendered": function(e2) {
          return nt.CustomRendered(parseInt(e2, 10));
        }, "exif:ExposureMode": function(e2) {
          return nt.ExposureMode(parseInt(e2, 10));
        }, "exif:ExposureProgram": function(e2) {
          return nt.ExposureProgram(parseInt(e2, 10));
        }, "exif:ExposureTime": function(e2) {
          return In(e2) ? nt.ExposureTime(e2.split("/").map(function(e3) {
            return parseInt(e3, 10);
          })) : e2;
        }, "exif:MeteringMode": function(e2) {
          return nt.MeteringMode(parseInt(e2, 10));
        }, "exif:Saturation": function(e2) {
          return nt.Saturation(parseInt(e2, 10));
        }, "exif:SceneCaptureType": function(e2) {
          return nt.SceneCaptureType(parseInt(e2, 10));
        }, "exif:Sharpness": function(e2) {
          return nt.Sharpness(parseInt(e2, 10));
        }, "exif:ShutterSpeedValue": function(e2) {
          return bn(nt.ShutterSpeedValue, e2);
        }, "exif:WhiteBalance": function(e2) {
          return nt.WhiteBalance(parseInt(e2, 10));
        } };
        function bn(e2, t2) {
          return In(t2) ? e2(t2.split("/")) : t2;
        }
        function In(e2) {
          return /^-?\d+\/-?\d+$/.test(e2);
        }
        function Cn(e2) {
          var t2, n2 = function(e3) {
            if (Array.isArray(e3)) return e3;
          }(t2 = e2.split(",")) || function(e3) {
            var t3 = null == e3 ? null : "undefined" != typeof Symbol && e3[Symbol.iterator] || e3["@@iterator"];
            if (null != t3) {
              var n3, r3, i3, o3, a3 = [], u3 = 1, c2 = 0;
              try {
                for (i3 = (t3 = t3.call(e3)).next, false; !(u3 = (n3 = i3.call(t3)).done) && (a3.push(n3.value), 2 !== a3.length); u3 = 1) ;
              } catch (e4) {
                c2 = 1, r3 = e4;
              } finally {
                try {
                  if (!u3 && null != t3.return && (o3 = t3.return(), Object(o3) !== o3)) return;
                } finally {
                  if (c2) throw r3;
                }
              }
              return a3;
            }
          }(t2) || function(e3) {
            if (e3) {
              if ("string" == typeof e3) return yn(e3, 2);
              var t3 = {}.toString.call(e3).slice(8, -1);
              return "Object" === t3 && e3.constructor && (t3 = e3.constructor.name), "Map" === t3 || "Set" === t3 ? Array.from(e3) : "Arguments" === t3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t3) ? yn(e3, 2) : void 0;
            }
          }(t2) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }(), r2 = n2[0], i2 = n2[1];
          if (void 0 !== r2 && void 0 !== i2) {
            var o2 = parseFloat(r2), a2 = parseFloat(i2), u2 = i2.charAt(i2.length - 1);
            if (!Number.isNaN(o2) && !Number.isNaN(a2)) return "" + (o2 + a2 / 60) + u2;
          }
          return e2;
        }
        var Un = { xmp: "http://ns.adobe.com/xap/1.0/", tiff: "http://ns.adobe.com/tiff/1.0/", exif: "http://ns.adobe.com/exif/1.0/", dc: "http://purl.org/dc/elements/1.1/", xmpMM: "http://ns.adobe.com/xap/1.0/mm/", stEvt: "http://ns.adobe.com/xap/1.0/sType/ResourceEvent#", stRef: "http://ns.adobe.com/xap/1.0/sType/ResourceRef#", photoshop: "http://ns.adobe.com/photoshop/1.0/" };
        function Pn(e2) {
          return Pn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e3) {
            return typeof e3;
          } : function(e3) {
            return e3 && "function" == typeof Symbol && e3.constructor === Symbol && e3 !== Symbol.prototype ? "symbol" : typeof e3;
          }, Pn(e2);
        }
        function An(e2, t2) {
          (null == t2 || t2 > e2.length) && (t2 = e2.length);
          for (var n2 = 0, r2 = Array(t2); n2 < t2; n2++) r2[n2] = e2[n2];
          return r2;
        }
        function En(e2) {
          var t2 = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
          return En = function(e3) {
            if (null === e3 || !function(e4) {
              try {
                return -1 !== Function.toString.call(e4).indexOf("[native code]");
              } catch (t3) {
                return "function" == typeof e4;
              }
            }(e3)) return e3;
            if ("function" != typeof e3) throw new TypeError("Super expression must either be null or a function");
            if (void 0 !== t2) {
              if (t2.has(e3)) return t2.get(e3);
              t2.set(e3, n2);
            }
            function n2() {
              return function(e4, t3, n3) {
                if (wn()) return Reflect.construct.apply(null, arguments);
                var r2 = [null];
                r2.push.apply(r2, t3);
                var i2 = new (e4.bind.apply(e4, r2))();
                return n3 && xn(i2, n3.prototype), i2;
              }(e3, arguments, Tn(this).constructor);
            }
            return n2.prototype = Object.create(e3.prototype, { constructor: { value: n2, enumerable: 0, writable: 1, configurable: 1 } }), xn(n2, e3);
          }, En(e2);
        }
        function wn() {
          try {
            var e2 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            }));
          } catch (e3) {
          }
          return (wn = function() {
            return !!e2;
          })();
        }
        function xn(e2, t2) {
          return xn = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e3, t3) {
            return e3.__proto__ = t3, e3;
          }, xn(e2, t2);
        }
        function Tn(e2) {
          return Tn = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e3) {
            return e3.__proto__ || Object.getPrototypeOf(e3);
          }, Tn(e2);
        }
        var On = { read: function(e2, t2, n2) {
          var r2 = {};
          if ("string" == typeof e2) return Rn(r2, e2, n2), r2;
          var i2, o2 = (i2 = function(e3, t3) {
            if (0 === t3.length) return [];
            var n3 = [Fn(e3, t3.slice(0, 1))];
            return t3.length > 1 && n3.push(Fn(e3, t3.slice(1))), n3;
          }(e2, t2), function(e3) {
            if (Array.isArray(e3)) return e3;
          }(i2) || function(e3) {
            var t3 = null == e3 ? null : "undefined" != typeof Symbol && e3[Symbol.iterator] || e3["@@iterator"];
            if (null != t3) {
              var n3, r3, i3, o3, a3 = [], u3 = 1, c3 = 0;
              try {
                for (i3 = (t3 = t3.call(e3)).next, false; !(u3 = (n3 = i3.call(t3)).done) && (a3.push(n3.value), 2 !== a3.length); u3 = 1) ;
              } catch (e4) {
                c3 = 1, r3 = e4;
              } finally {
                try {
                  if (!u3 && null != t3.return && (o3 = t3.return(), Object(o3) !== o3)) return;
                } finally {
                  if (c3) throw r3;
                }
              }
              return a3;
            }
          }(i2) || function(e3) {
            if (e3) {
              if ("string" == typeof e3) return An(e3, 2);
              var t3 = {}.toString.call(e3).slice(8, -1);
              return "Object" === t3 && e3.constructor && (t3 = e3.constructor.name), "Map" === t3 || "Set" === t3 ? Array.from(e3) : "Arguments" === t3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t3) ? An(e3, 2) : void 0;
            }
          }(i2) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }()), a2 = o2[0], u2 = o2[1], c2 = Rn(r2, a2, n2);
          if (u2) {
            var f2 = Rn(r2, u2, n2);
            c2 || f2 || (delete r2._raw, Rn(r2, Fn(e2, t2), n2));
          }
          return r2;
        } }, Mn = function(e2) {
          function t2(e3) {
            var n3;
            return function(e4, t3) {
              if (!(e4 instanceof t3)) throw new TypeError("Cannot call a class as a function");
            }(this, t2), (n3 = function(e4, t3, n4) {
              return t3 = Tn(t3), function(e5, t4) {
                if (t4 && ("object" == Pn(t4) || "function" == typeof t4)) return t4;
                if (void 0 !== t4) throw new TypeError("Derived constructors may only return object or undefined");
                return function(e6) {
                  if (void 0 === e6) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                  return e6;
                }(e5);
              }(e4, wn() ? Reflect.construct(t3, n4 || [], Tn(e4).constructor) : t3.apply(e4, n4));
            }(this, t2, [e3])).name = "ParseError", n3;
          }
          return function(e3, t3) {
            if ("function" != typeof t3 && null !== t3) throw new TypeError("Super expression must either be null or a function");
            e3.prototype = Object.create(t3 && t3.prototype, { constructor: { value: e3, writable: 1, configurable: 1 } }), Object.defineProperty(e3, "prototype", { writable: 0 }), t3 && xn(e3, t3);
          }(t2, e2), Object.defineProperty(n2 = t2, "prototype", { writable: 0 }), n2;
          var n2;
        }(En(Error));
        function Fn(e2, t2) {
          for (var n2 = t2.reduce(function(e3, t3) {
            return e3 + t3.length;
          }, 0), r2 = new Uint8Array(n2), i2 = 0, o2 = 0; o2 < t2.length; o2++) {
            var a2 = t2[o2], u2 = e2.buffer.slice(a2.dataOffset, a2.dataOffset + a2.length);
            r2.set(new Uint8Array(u2), i2), i2 += a2.length;
          }
          return new DataView(r2.buffer);
        }
        function Rn(e2, t2, n2) {
          try {
            var r2 = function(e3, t3) {
              var n3 = function(e4) {
                if (e4) return e4;
                if ("undefined" != typeof DOMParser) return new DOMParser();
                try {
                  var t4 = require_lib();
                  return new (0, t4.DOMParser)({ onError: t4.onErrorStopParsing });
                } catch (e5) {
                  return;
                }
              }(t3);
              if (!n3) throw console.warn("Warning: DOMParser is not available. It is needed to be able to parse XMP tags."), Error();
              var r3 = "string" == typeof e3 ? e3 : a(e3, 0, e3.byteLength);
              return { doc: kn(n3, r3.replace(/^.+(<\?xpacket begin)/, "$1").replace(/(<\?xpacket end=".*"\?>).+$/, "$1")), raw: r3 };
            }(t2, n2), i2 = r2.doc, o2 = r2.raw;
            return e2._raw = (e2._raw || "") + o2, l(e2, _n(Nn(Dn(i2), 1))), 1;
          } catch (e3) {
            return 0;
          }
        }
        function kn(e2, t2) {
          var n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
          try {
            var r2 = e2.parseFromString(t2, "application/xml"), i2 = r2.getElementsByTagName("parsererror");
            if (i2.length > 0) throw new Mn(i2[0].textContent);
            return r2;
          } catch (r3) {
            if ("ParseError" === r3.name && function(e3) {
              for (var t3 = ["prefix is non-null and namespace is null", "prefix not bound to a namespace", "prefix inte bundet till en namnrymd", /Namespace prefix .+ is not defined/], n3 = 0; n3 < t3.length; n3++) if (RegExp(t3[n3]).test(e3.message)) return 1;
              return 0;
            }(r3) && !n2) return kn(e2, function(e3) {
              var t3 = e3.match(/<([A-Za-z_][A-Za-z0-9._-]*)([^>]*)>/);
              if (!t3) return e3;
              var n3 = t3[1], r4 = function(e4) {
                for (var t4, n4 = [], r5 = /xmlns:([\w-]+)=["'][^"']+["']/g; null !== (t4 = r5.exec(e4)); ) -1 === n4.indexOf(t4[1]) && n4.push(t4[1]);
                return n4;
              }(e3), i3 = function(e4) {
                for (var t4, n4 = [], r5 = /\b([A-Za-z_][A-Za-z0-9._-]*):[A-Za-z_][A-Za-z0-9._-]*\b/g; null !== (t4 = r5.exec(e4)); ) {
                  var i4 = t4[1];
                  "xmlns" !== i4 && "xml" !== i4 && -1 === n4.indexOf(i4) && n4.push(i4);
                }
                return n4;
              }(e3).filter(function(e4) {
                return -1 === r4.indexOf(e4);
              });
              return 0 === i3.length ? e3 : function(e4, t4, n4) {
                var r5 = RegExp("<" + t4 + "([^>]*)>");
                return e4.replace(r5, "<" + t4 + "$1" + n4 + ">");
              }(e3, n3, function(e4) {
                for (var t4 = [], n4 = 0; n4 < e4.length; n4++) {
                  var r5 = e4[n4], i4 = Un[r5] || "http://fallback.namespace/" + r5;
                  t4.push(" xmlns:" + r5 + '="' + i4 + '"');
                }
                return t4.join("");
              }(i3));
            }(t2), 1);
            throw r3;
          }
        }
        function Dn(e2) {
          for (var t2 = 0; t2 < e2.childNodes.length; t2++) {
            if ("x:xmpmeta" === e2.childNodes[t2].tagName) return Dn(e2.childNodes[t2]);
            if ("rdf:RDF" === e2.childNodes[t2].tagName) return e2.childNodes[t2];
          }
          throw Error();
        }
        function Nn(e2) {
          var t2, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, r2 = function(e3) {
            for (var t3 = [], n3 = 0; n3 < e3.childNodes.length; n3++) t3.push(e3.childNodes[n3]);
            return t3;
          }(e2);
          return 1 === (t2 = r2).length && "#text" === t2[0].nodeName ? n2 ? {} : function(e3) {
            return e3.nodeValue;
          }(r2[0]) : function(e3) {
            var t3 = {};
            return e3.forEach(function(e4) {
              if (function(e5) {
                return e5.nodeName && "#text" !== e5.nodeName;
              }(e4)) {
                var n3 = function(e5) {
                  return { attributes: Ln(e5), value: Nn(e5) };
                }(e4);
                void 0 !== t3[e4.nodeName] ? (Array.isArray(t3[e4.nodeName]) || (t3[e4.nodeName] = [t3[e4.nodeName]]), t3[e4.nodeName].push(n3)) : t3[e4.nodeName] = n3;
              }
            }), t3;
          }(r2);
        }
        function Ln(e2) {
          for (var t2 = {}, n2 = 0; n2 < e2.attributes.length; n2++) t2[e2.attributes[n2].nodeName] = decodeURIComponent(escape(e2.attributes[n2].value));
          return t2;
        }
        function _n(e2) {
          var t2 = {};
          if ("string" == typeof e2) return e2;
          for (var n2 in e2) {
            var r2 = e2[n2];
            Array.isArray(r2) || (r2 = [r2]), r2.forEach(function(e3) {
              l(t2, Bn(e3.attributes)), "object" === Pn(e3.value) && l(t2, Wn(e3.value));
            });
          }
          return t2;
        }
        function Bn(e2) {
          var t2 = {};
          for (var n2 in e2) try {
            Gn(n2) && (t2[zn(n2)] = { value: e2[n2], attributes: {}, description: Vn(e2[n2], n2) });
          } catch (e3) {
          }
          return t2;
        }
        function Gn(e2) {
          return "rdf:parseType" !== e2 && !jn(e2);
        }
        function jn(e2) {
          return "xmlns" === e2.split(":")[0];
        }
        function zn(e2) {
          return /^MicrosoftPhoto(_\d+_)?:Rating$/i.test(e2) ? "RatingPercent" : e2.split(":")[1];
        }
        function Vn(e2) {
          var t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : void 0;
          if (Array.isArray(e2)) {
            var n2 = function(e3) {
              return e3.map(function(e4) {
                return void 0 !== e4.value ? Vn(e4.value) : Vn(e4);
              }).join(", ");
            }(e2);
            return t2 && "function" == typeof Sn[t2] ? Sn[t2](e2, n2) : n2;
          }
          if ("object" === Pn(e2)) return function(e3) {
            var t3 = [];
            for (var n3 in e3) t3.push("".concat(Hn(n3), ": ").concat(Vn(e3[n3].value)));
            return t3.join("; ");
          }(e2);
          try {
            return t2 && "function" == typeof Sn[t2] ? Sn[t2](e2) : decodeURIComponent(escape(e2));
          } catch (t3) {
            return e2;
          }
        }
        function Hn(e2) {
          return "CiAdrCity" === e2 ? "CreatorCity" : "CiAdrCtry" === e2 ? "CreatorCountry" : "CiAdrExtadr" === e2 ? "CreatorAddress" : "CiAdrPcode" === e2 ? "CreatorPostalCode" : "CiAdrRegion" === e2 ? "CreatorRegion" : "CiEmailWork" === e2 ? "CreatorWorkEmail" : "CiTelWork" === e2 ? "CreatorWorkPhone" : "CiUrlWork" === e2 ? "CreatorWorkUrl" : e2;
        }
        function Wn(e2) {
          var t2 = {};
          for (var n2 in e2) try {
            jn(n2) || (t2[zn(n2)] = Xn(e2[n2], n2));
          } catch (e3) {
          }
          return t2;
        }
        function Xn(e2, t2) {
          return function(e3) {
            return Array.isArray(e3);
          }(e2) ? function(e3, t3) {
            return tr(e3[e3.length - 1], t3);
          }(e2, t2) : function(e3) {
            return "Resource" === e3.attributes["rdf:parseType"] && "string" == typeof e3.value && "" === e3.value.trim();
          }(e2) ? { value: "", attributes: {}, description: "" } : Jn(e2) ? Yn(e2, t2) : qn(e2) ? $n(e2, t2) : Zn(e2) ? Qn(e2, t2) : function(e3) {
            return void 0 !== er(e3.value);
          }(e2) ? function(e3, t3) {
            var n2 = er(e3.value).value["rdf:li"], r2 = Kn(e3), i2 = [];
            return void 0 === n2 ? n2 = [] : Array.isArray(n2) || (n2 = [n2]), n2.forEach(function(e4) {
              i2.push(function(e5) {
                return Jn(e5) ? Yn(e5) : qn(e5) ? $n(e5).value : Zn(e5) ? Qn(e5).value : tr(e5);
              }(e4));
            }), { value: i2, attributes: r2, description: Vn(i2, t3) };
          }(e2, t2) : tr(e2, t2);
        }
        function Jn(e2) {
          return "Resource" === e2.attributes["rdf:parseType"] && void 0 !== e2.value["rdf:value"] || void 0 !== e2.value["rdf:Description"] && void 0 !== e2.value["rdf:Description"].value["rdf:value"];
        }
        function Yn(e2, t2) {
          var n2 = Kn(e2);
          void 0 !== e2.value["rdf:Description"] && (e2 = e2.value["rdf:Description"]), l(n2, Kn(e2), function(e3) {
            var t3 = {};
            for (var n3 in e3.value) "rdf:value" === n3 || jn(n3) || (t3[zn(n3)] = e3.value[n3].value);
            return t3;
          }(e2));
          var r2 = function(e3) {
            return nr(e3.value["rdf:value"]) || e3.value["rdf:value"].value;
          }(e2);
          return { value: r2, attributes: n2, description: Vn(r2, t2) };
        }
        function Kn(e2) {
          var t2 = {};
          for (var n2 in e2.attributes) "rdf:parseType" === n2 || "rdf:resource" === n2 || jn(n2) || (t2[zn(n2)] = e2.attributes[n2]);
          return t2;
        }
        function qn(e2) {
          return "Resource" === e2.attributes["rdf:parseType"] || void 0 !== e2.value["rdf:Description"] && void 0 === e2.value["rdf:Description"].value["rdf:value"];
        }
        function $n(e2, t2) {
          var n2 = { value: {}, attributes: {} };
          return void 0 !== e2.value["rdf:Description"] && (l(n2.value, Bn(e2.value["rdf:Description"].attributes)), l(n2.attributes, Kn(e2)), e2 = e2.value["rdf:Description"]), l(n2.value, Wn(e2.value)), n2.description = Vn(n2.value, t2), n2;
        }
        function Zn(e2) {
          return 0 === Object.keys(e2.value).length && void 0 === e2.attributes["xml:lang"] && void 0 === e2.attributes["rdf:resource"];
        }
        function Qn(e2, t2) {
          var n2 = Bn(e2.attributes);
          return { value: n2, attributes: {}, description: Vn(n2, t2) };
        }
        function er(e2) {
          return e2["rdf:Bag"] || e2["rdf:Seq"] || e2["rdf:Alt"];
        }
        function tr(e2, t2) {
          var n2 = nr(e2) || _n(e2.value);
          return { value: n2, attributes: Kn(e2), description: Vn(n2, t2) };
        }
        function nr(e2) {
          return e2.attributes && e2.attributes["rdf:resource"];
        }
        function rr(e2) {
          return rr = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e3) {
            return typeof e3;
          } : function(e3) {
            return e3 && "function" == typeof Symbol && e3.constructor === Symbol && e3 !== Symbol.prototype ? "symbol" : typeof e3;
          }, rr(e2);
        }
        function ir(e2, t2, n2) {
          return (t2 = function(e3) {
            var t3 = function(e4) {
              if ("object" != rr(e4) || !e4) return e4;
              var t4 = e4[Symbol.toPrimitive];
              if (void 0 !== t4) {
                var n3 = t4.call(e4, "string");
                if ("object" != rr(n3)) return n3;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return e4 + "";
            }(e3);
            return "symbol" == rr(t3) ? t3 : t3 + "";
          }(t2)) in e2 ? Object.defineProperty(e2, t2, { value: n2, enumerable: 1, configurable: 1, writable: 1 }) : e2[t2] = n2, e2;
        }
        function or(e2, t2) {
          (null == t2 || t2 > e2.length) && (t2 = e2.length);
          for (var n2 = 0, r2 = Array(t2); n2 < t2; n2++) r2[n2] = e2[n2];
          return r2;
        }
        var ar = { 2e3: { name: "PathInformation", description: function(e2) {
          for (var t2 = {}, n2 = [], r2 = 0; r2 < e2.byteLength; r2 += 26) {
            var i2 = It.getShortAt(e2, r2);
            ur[i2] && (t2[i2] || (t2[i2] = ur[i2].description), n2.push({ type: i2, path: ur[i2].path(e2, r2 + 2) }));
          }
          return JSON.stringify({ types: t2, paths: n2 });
        } }, 2999: { name: "ClippingPathName", description: function(e2) {
          return (t2 = f(e2, 0), function(e3) {
            if (Array.isArray(e3)) return e3;
          }(t2) || function(e3) {
            var t3 = null == e3 ? null : "undefined" != typeof Symbol && e3[Symbol.iterator] || e3["@@iterator"];
            if (null != t3) {
              var n2, r2, i2, o2, a2 = [], u2 = 1, c2 = 0;
              try {
                for (i2 = (t3 = t3.call(e3)).next, false; !(u2 = (n2 = i2.call(t3)).done) && (a2.push(n2.value), 2 !== a2.length); u2 = 1) ;
              } catch (e4) {
                c2 = 1, r2 = e4;
              } finally {
                try {
                  if (!u2 && null != t3.return && (o2 = t3.return(), Object(o2) !== o2)) return;
                } finally {
                  if (c2) throw r2;
                }
              }
              return a2;
            }
          }(t2) || function(e3) {
            if (e3) {
              if ("string" == typeof e3) return or(e3, 2);
              var t3 = {}.toString.call(e3).slice(8, -1);
              return "Object" === t3 && e3.constructor && (t3 = e3.constructor.name), "Map" === t3 || "Set" === t3 ? Array.from(e3) : "Arguments" === t3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t3) ? or(e3, 2) : void 0;
            }
          }(t2) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }())[1];
          var t2;
        } } }, ur = ir(ir(ir(ir(ir(ir(ir(ir(ir({}, 0, { description: "Closed subpath length", path: function(e2, t2) {
          return [It.getShortAt(e2, t2)];
        } }), 1, { description: "Closed subpath Bezier knot, linked", path: cr }), 2, { description: "Closed subpath Bezier knot, unlinked", path: cr }), 3, { description: "Open subpath length", path: function(e2, t2) {
          return [It.getShortAt(e2, t2)];
        } }), 4, { description: "Open subpath Bezier knot, linked", path: cr }), 5, { description: "Open subpath Bezier knot, unlinked", path: cr }), 6, { description: "Path fill rule", path: function() {
          return [];
        } }), 8, { description: "Initial fill rule", path: function(e2, t2) {
          return [It.getShortAt(e2, t2)];
        } }), 7, { description: "Clipboard", path: function(e2, t2) {
          return [[sr(e2, t2, 8), sr(e2, t2 + 4, 8), sr(e2, t2 + 8, 8), sr(e2, t2 + 12, 8)], sr(e2, t2 + 16, 8)];
        } });
        function cr(e2, t2) {
          for (var n2 = [], r2 = 0; r2 < 24; r2 += 8) n2.push(fr(e2, t2 + r2));
          return n2;
        }
        function fr(e2, t2) {
          var n2 = sr(e2, t2, 8);
          return [sr(e2, t2 + 4, 8), n2];
        }
        function sr(e2, t2, n2) {
          var r2, i2 = It.getLongAt(e2, t2), o2 = i2 >>> 31 == 0 ? 1 : -1, a2 = (2130706432 & i2) >>> 32 - n2, u2 = i2 & parseInt(m("1", 32 - n2), 2);
          return o2 * function(e3) {
            return parseInt(e3.replace(".", ""), 2) / Math.pow(2, (e3.split(".")[1] || "").length);
          }(a2.toString(2) + "." + (m("0", 32 - n2 - (r2 = u2.toString(2)).length) + r2));
        }
        function lr(e2, t2) {
          (null == t2 || t2 > e2.length) && (t2 = e2.length);
          for (var n2 = 0, r2 = Array(t2); n2 < t2; n2++) r2[n2] = e2[n2];
          return r2;
        }
        var dr = { read: function(e2, t2) {
          for (var n2 = o(new Uint8Array(e2).buffer), r2 = {}, i2 = 0; i2 < e2.length; ) {
            var u2 = a(n2, i2, vr);
            i2 += vr;
            var c2 = It.getShortAt(n2, i2), f2 = hr(n2, i2 += mr), s2 = f2.tagName;
            i2 += f2.tagNameSize;
            var l2 = It.getLongAt(n2, i2);
            if (i2 += gr, u2 === pr) {
              var d2 = o(n2.buffer, i2, l2), p2 = { id: c2, value: a(d2, 0, l2) };
              if (ar[c2]) {
                try {
                  p2.description = ar[c2].description(d2);
                } catch (e3) {
                  p2.description = "<no description formatter>";
                }
                r2[s2 || ar[c2].name] = p2;
              } else t2 && (r2["undefined-".concat(c2)] = p2);
            }
            i2 += l2 + l2 % 2;
          }
          return r2;
        } }, pr = "8BIM", mr = 2, gr = 4, vr = pr.length;
        function hr(e2, t2) {
          var n2, r2 = function(e3) {
            if (Array.isArray(e3)) return e3;
          }(n2 = f(e2, t2)) || function(e3) {
            var t3 = null == e3 ? null : "undefined" != typeof Symbol && e3[Symbol.iterator] || e3["@@iterator"];
            if (null != t3) {
              var n3, r3, i3, o2, a2 = [], u2 = 1, c2 = 0;
              try {
                for (i3 = (t3 = t3.call(e3)).next, false; !(u2 = (n3 = i3.call(t3)).done) && (a2.push(n3.value), 2 !== a2.length); u2 = 1) ;
              } catch (e4) {
                c2 = 1, r3 = e4;
              } finally {
                try {
                  if (!u2 && null != t3.return && (o2 = t3.return(), Object(o2) !== o2)) return;
                } finally {
                  if (c2) throw r3;
                }
              }
              return a2;
            }
          }(n2) || function(e3) {
            if (e3) {
              if ("string" == typeof e3) return lr(e3, 2);
              var t3 = {}.toString.call(e3).slice(8, -1);
              return "Object" === t3 && e3.constructor && (t3 = e3.constructor.name), "Map" === t3 || "Set" === t3 ? Array.from(e3) : "Arguments" === t3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t3) ? lr(e3, 2) : void 0;
            }
          }(n2) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
          }(), i2 = r2[0];
          return { tagName: r2[1], tagNameSize: 1 + i2 + (i2 % 2 == 0 ? 1 : 0) };
        }
        var yr = { desc: { name: "ICC Description" }, cprt: { name: "ICC Copyright" }, dmdd: { name: "ICC Device Model Description" }, vued: { name: "ICC Viewing Conditions Description" }, dmnd: { name: "ICC Device Manufacturer for Display" }, tech: { name: "Technology" } }, Sr = { 4: { name: "Preferred CMM type", value: function(e2, t2) {
          return a(e2, t2, 4);
        }, description: function(e2) {
          return null !== e2 ? br(e2) : "";
        } }, 8: { name: "Profile Version", value: function(e2, t2) {
          return e2.getUint8(t2).toString(10) + "." + (e2.getUint8(t2 + 1) >> 4).toString(10) + "." + (e2.getUint8(t2 + 1) % 16).toString(10);
        } }, 12: { name: "Profile/Device class", value: function(e2, t2) {
          return a(e2, t2, 4);
        }, description: function(e2) {
          switch (e2.toLowerCase()) {
            case "scnr":
              return "Input Device profile";
            case "mntr":
              return "Display Device profile";
            case "prtr":
              return "Output Device profile";
            case "link":
              return "DeviceLink profile";
            case "abst":
              return "Abstract profile";
            case "spac":
              return "ColorSpace profile";
            case "nmcl":
              return "NamedColor profile";
            case "cenc":
              return "ColorEncodingSpace profile";
            case "mid ":
              return "MultiplexIdentification profile";
            case "mlnk":
              return "MultiplexLink profile";
            case "mvis":
              return "MultiplexVisualization profile";
            default:
              return e2;
          }
        } }, 16: { name: "Color Space", value: function(e2, t2) {
          return a(e2, t2, 4);
        } }, 20: { name: "Connection Space", value: function(e2, t2) {
          return a(e2, t2, 4);
        } }, 24: { name: "ICC Profile Date", value: function(e2, t2) {
          return function(e3, t3) {
            var n2 = e3.getUint16(t3), r2 = e3.getUint16(t3 + 2) - 1, i2 = e3.getUint16(t3 + 4), o2 = e3.getUint16(t3 + 6), a2 = e3.getUint16(t3 + 8), u2 = e3.getUint16(t3 + 10);
            return new Date(Date.UTC(n2, r2, i2, o2, a2, u2));
          }(e2, t2).toISOString();
        } }, 36: { name: "ICC Signature", value: function(e2, t2) {
          return n2 = e2.buffer.slice(t2, t2 + 4), String.fromCharCode.apply(null, new Uint8Array(n2));
          var n2;
        } }, 40: { name: "Primary Platform", value: function(e2, t2) {
          return a(e2, t2, 4);
        }, description: function(e2) {
          return br(e2);
        } }, 48: { name: "Device Manufacturer", value: function(e2, t2) {
          return a(e2, t2, 4);
        }, description: function(e2) {
          return br(e2);
        } }, 52: { name: "Device Model Number", value: function(e2, t2) {
          return a(e2, t2, 4);
        } }, 64: { name: "Rendering Intent", value: function(e2, t2) {
          return e2.getUint32(t2);
        }, description: function(e2) {
          switch (e2) {
            case 0:
              return "Perceptual";
            case 1:
              return "Relative Colorimetric";
            case 2:
              return "Saturation";
            case 3:
              return "Absolute Colorimetric";
            default:
              return e2;
          }
        } }, 80: { name: "Profile Creator", value: function(e2, t2) {
          return a(e2, t2, 4);
        } } };
        function br(e2) {
          switch (e2.toLowerCase()) {
            case "appl":
              return "Apple";
            case "adbe":
              return "Adobe";
            case "msft":
              return "Microsoft";
            case "sunw":
              return "Sun Microsystems";
            case "sgi":
              return "Silicon Graphics";
            case "tgnt":
              return "Taligent";
            default:
              return e2;
          }
        }
        var Ir = { read: function(e2, t2, n2) {
          return n2 && t2[0].compressionMethod !== g ? function(e3, t3) {
            return 0 !== t3[0].compressionMethod ? {} : v(new DataView(e3.buffer.slice(t3[0].offset, t3[0].offset + t3[0].length)), t3[0].compressionMethod, "utf-8", "dataview").then(Mr).catch(function() {
              return {};
            });
          }(e2, t2) : function(e3, t3) {
            try {
              for (var n3 = t3.reduce(function(e4, t4) {
                return e4 + t4.length;
              }, 0), r2 = new Uint8Array(n3), i2 = 0, o2 = function(e4) {
                return Array.isArray(e4) ? new DataView(Uint8Array.from(e4).buffer).buffer : e4.buffer;
              }(e3), a2 = function(e4) {
                var n4 = t3.find(function(t4) {
                  return t4.chunkNumber === e4;
                });
                if (!n4) throw Error("ICC chunk ".concat(e4, " not found"));
                var a3 = o2.slice(n4.offset, n4.offset + n4.length), u3 = new Uint8Array(a3);
                r2.set(u3, i2), i2 += u3.length;
              }, u2 = 1; u2 <= t3.length; u2++) a2(u2);
              return Mr(new DataView(r2.buffer));
            } catch (e4) {
              return {};
            }
          }(e2, t2);
        } }, Cr = 84, Ur = 128, Pr = "acsp", Ar = "desc", Er = "mluc", wr = "text", xr = "sig ", Tr = 12;
        function Or(e2, t2) {
          return e2.length < t2 + Tr;
        }
        function Mr(e2) {
          var t2 = e2.buffer, n2 = e2.getUint32();
          if (e2.byteLength !== n2) throw Error("ICC profile length not matching");
          if (e2.length < Cr) throw Error("ICC profile too short");
          for (var r2 = {}, i2 = Object.keys(Sr), o2 = 0; o2 < i2.length; o2++) {
            var u2 = i2[o2], f2 = Sr[u2], s2 = f2.value(e2, parseInt(u2, 10)), l2 = s2;
            f2.description && (l2 = f2.description(s2)), r2[f2.name] = { value: s2, description: l2 };
          }
          if (Fr(t2.slice(36, 40)) !== Pr) throw Error("ICC profile: missing signature");
          if (function(e3) {
            return e3.length < Ur + 4;
          }(t2)) return r2;
          for (var d2 = e2.getUint32(128), p2 = 132, m2 = 0; m2 < d2; m2++) {
            if (Or(t2, p2)) return r2;
            var g2 = a(e2, p2, 4), v2 = e2.getUint32(p2 + 4), h2 = e2.getUint32(p2 + 8);
            if (v2 > t2.length) return r2;
            var y2 = a(e2, v2, 4);
            if (y2 === Ar) {
              var S2 = e2.getUint32(v2 + 8);
              if (S2 > h2) return r2;
              Rr(r2, g2, Fr(t2.slice(v2 + 12, v2 + S2 + 11)));
            } else if (y2 === Er) {
              for (var b2 = e2.getUint32(v2 + 8), I2 = e2.getUint32(v2 + 12), C2 = v2 + 16, U2 = [], P2 = 0; P2 < b2; P2++) {
                var A2 = a(e2, C2 + 0, 2), E2 = a(e2, C2 + 2, 2), w2 = e2.getUint32(C2 + 4), x2 = e2.getUint32(C2 + 8), T2 = c(e2, v2 + x2, w2);
                U2.push({ languageCode: A2, countryCode: E2, text: T2 }), C2 += I2;
              }
              if (1 === b2) Rr(r2, g2, U2[0].text);
              else {
                for (var O2 = {}, M2 = 0; M2 < U2.length; M2++) O2["".concat(U2[M2].languageCode, "-").concat(U2[M2].countryCode)] = U2[M2].text;
                Rr(r2, g2, O2);
              }
            } else y2 === wr ? Rr(r2, g2, Fr(t2.slice(v2 + 8, v2 + h2 - 7))) : y2 === xr && Rr(r2, g2, Fr(t2.slice(v2 + 8, v2 + 12)));
            p2 += 12;
          }
          return r2;
        }
        function Fr(e2) {
          return String.fromCharCode.apply(null, new Uint8Array(e2));
        }
        function Rr(e2, t2, n2) {
          yr[t2] ? e2[yr[t2].name] = { value: n2, description: n2 } : e2[t2] = { value: n2, description: n2 };
        }
        var kr = { read: function(e2, t2, n2, r2, i2) {
          var o2 = wt(e2, vt, t2, t2 + n2, r2, i2);
          return o2.ShotInfo && delete (o2 = l({}, o2, function(e3) {
            var t3, n3 = {};
            return void 0 !== e3[27] && (n3.AutoRotate = { value: e3[27], description: (t3 = e3[27], 0 === t3 ? "None" : 1 === t3 ? "Rotate 90 CW" : 2 === t3 ? "Rotate 180" : 3 === t3 ? "Rotate 270 CW" : "Unknown") }), n3;
          }(o2.ShotInfo.value))).ShotInfo, o2;
        }, SHOT_INFO_AUTO_ROTATE: 27 }, Dr = { K3_III: 78420 }, Nr = { CAMERA_ORIENTATION: 1, ROLL_ANGLE: 3, PITCH_ANGLE: 5 }, Lr = { read: function(e2, t2, n2, r2) {
          var i2 = U(e2, t2 + n2 + 8), o2 = t2 + n2, a2 = wt(e2, ht, o2, o2 + 10, i2, r2);
          return function(e3) {
            return e3.PentaxModelID && e3.PentaxModelID.value === Dr.K3_III && e3.LevelInfo;
          }(a2) && (a2 = l({}, a2, function(e3, t3, n3) {
            var r3 = {};
            if (t3 + 7 > e3.byteLength) return r3;
            var i3, o3 = e3.getInt8(t3 + Nr.CAMERA_ORIENTATION);
            r3.CameraOrientation = { value: o3, description: (i3 = o3, 0 === i3 ? "Horizontal (normal)" : 1 === i3 ? "Rotate 270 CW" : 2 === i3 ? "Rotate 180" : 3 === i3 ? "Rotate 90 CW" : 4 === i3 ? "Upwards" : 5 === i3 ? "Downwards" : "Unknown") };
            var a3 = e3.getInt16(t3 + Nr.ROLL_ANGLE, n3 === C);
            r3.RollAngle = { value: a3, description: _r(a3) };
            var u2 = e3.getInt16(t3 + Nr.PITCH_ANGLE, n3 === C);
            return r3.PitchAngle = { value: u2, description: Br(u2) }, r3;
          }(e2, o2 + a2.LevelInfo.__offset, i2)), delete a2.LevelInfo), a2;
        }, PENTAX_IFD_OFFSET: 10, MODEL_ID: Dr, LIK3III: Nr };
        function _r(e2) {
          return "" + -0.5 * e2;
        }
        function Br(e2) {
          return "" + -0.5 * e2;
        }
        var Gr = { read: function(e2, t2) {
          return { "Image Width": jr(e2, t2), "Image Height": zr(e2, t2), "Bit Depth": Vr(e2, t2), "Color Type": Hr(e2, t2), Compression: Wr(e2, t2), Filter: Xr(e2, t2), Interlace: Jr(e2, t2) };
        } };
        function jr(e2, t2) {
          if (!(t2 + 0 + 4 > e2.byteLength)) {
            var n2 = It.getLongAt(e2, t2);
            return { value: n2, description: "".concat(n2, "px") };
          }
        }
        function zr(e2, t2) {
          if (!(t2 + 4 + 4 > e2.byteLength)) {
            var n2 = It.getLongAt(e2, t2 + 4);
            return { value: n2, description: "".concat(n2, "px") };
          }
        }
        function Vr(e2, t2) {
          if (!(t2 + 8 + 1 > e2.byteLength)) {
            var n2 = It.getByteAt(e2, t2 + 8);
            return { value: n2, description: "".concat(n2) };
          }
        }
        function Hr(e2, t2) {
          if (!(t2 + 9 + 1 > e2.byteLength)) {
            var n2 = It.getByteAt(e2, t2 + 9);
            return { value: n2, description: { 0: "Grayscale", 2: "RGB", 3: "Palette", 4: "Grayscale with Alpha", 6: "RGB with Alpha" }[n2] || "Unknown" };
          }
        }
        function Wr(e2, t2) {
          if (!(t2 + 10 + 1 > e2.byteLength)) {
            var n2 = It.getByteAt(e2, t2 + 10);
            return { value: n2, description: 0 === n2 ? "Deflate/Inflate" : "Unknown" };
          }
        }
        function Xr(e2, t2) {
          if (!(t2 + 11 + 1 > e2.byteLength)) {
            var n2 = It.getByteAt(e2, t2 + 11);
            return { value: n2, description: 0 === n2 ? "Adaptive" : "Unknown" };
          }
        }
        function Jr(e2, t2) {
          if (!(t2 + 12 + 1 > e2.byteLength)) {
            var n2 = It.getByteAt(e2, t2 + 12);
            return { value: n2, description: { 0: "Noninterlaced", 1: "Adam7 Interlace" }[n2] || "Unknown" };
          }
        }
        function Yr(e2) {
          return Yr = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e3) {
            return typeof e3;
          } : function(e3) {
            return e3 && "function" == typeof Symbol && e3.constructor === Symbol && e3 !== Symbol.prototype ? "symbol" : typeof e3;
          }, Yr(e2);
        }
        var Kr = { read: function(e2, t2, n2, r2) {
          for (var i2 = {}, o2 = [], a2 = 0; a2 < t2.length; a2++) {
            var u2 = t2[a2], c2 = ii(e2, u2.offset, u2.length, u2.type, n2);
            if (c2 instanceof Promise) o2.push(c2.then(function(e3) {
              var t3, n3, i3, o3 = e3.name, a3 = e3.value, u3 = e3.description;
              try {
                if (h.USE_EXIF && si(o3, a3)) return { __exif: kt.read(di(a3), ri, r2).tags };
                if (h.USE_IPTC && li(o3, a3)) return { __iptc: sn.read(di(a3), 0, r2) };
                if (o3 && !si(o3, a3) && !li(o3, a3)) return t3 = {}, i3 = { value: a3, description: u3 }, (n3 = function(e4) {
                  var t4 = function(e5) {
                    if ("object" != Yr(e5) || !e5) return e5;
                    var t5 = e5[Symbol.toPrimitive];
                    if (void 0 !== t5) {
                      var n4 = t5.call(e5, "string");
                      if ("object" != Yr(n4)) return n4;
                      throw new TypeError("@@toPrimitive must return a primitive value.");
                    }
                    return e5 + "";
                  }(e4);
                  return "symbol" == Yr(t4) ? t4 : t4 + "";
                }(n3 = o3)) in t3 ? Object.defineProperty(t3, n3, { value: i3, enumerable: 1, configurable: 1, writable: 1 }) : t3[n3] = i3, t3;
              } catch (e4) {
              }
              return {};
            }));
            else {
              var f2 = c2.name, s2 = c2.value, l2 = c2.description;
              f2 && (i2[f2] = { value: s2, description: l2 });
            }
          }
          return { readTags: i2, readTagsPromise: o2.length > 0 ? Promise.all(o2) : void 0 };
        } }, qr = "STATE_KEYWORD", $r = "STATE_COMPRESSION", Zr = "STATE_LANG", Qr = "STATE_TRANSLATED_KEYWORD", ei = "STATE_TEXT", ti = 1, ni = 1, ri = 6;
        function ii(e2, t2, n2, r2, i2) {
          for (var o2, a2 = [], u2 = [], c2 = [], f2 = qr, s2 = g, l2 = 0; l2 < n2 && t2 + l2 < e2.byteLength; l2++) if (f2 !== $r) {
            if (f2 === ei) {
              o2 = new DataView(e2.buffer.slice(t2 + l2, t2 + n2));
              break;
            }
            var d2 = e2.getUint8(t2 + l2);
            0 === d2 ? f2 = ai(r2, f2) : f2 === qr ? a2.push(d2) : f2 === Zr ? u2.push(d2) : f2 === Qr && c2.push(d2);
          } else s2 = oi({ type: r2, dataView: e2, offset: t2 + l2 }), r2 === Ae && (l2 += ti), f2 = ai(r2, f2);
          if (s2 !== g && !i2) return {};
          var p2 = v(o2, s2, /* @__PURE__ */ function(e3) {
            return e3 === Pe || e3 === Ee ? "latin1" : "utf-8";
          }(r2));
          return p2 instanceof Promise ? p2.then(function(e3) {
            return ui(e3, r2, u2, a2);
          }).catch(function() {
            return ui("<text using unknown compression>".split(""), r2, u2, a2);
          }) : ui(p2, r2, u2, a2);
        }
        function oi(e2) {
          var t2 = e2.type, n2 = e2.dataView, r2 = e2.offset;
          if (t2 === Ae) {
            if (n2.getUint8(r2) === ni) return n2.getUint8(r2 + 1);
          } else if (t2 === Ee) return n2.getUint8(r2);
          return g;
        }
        function ai(e2, t2) {
          return t2 === qr && [Ae, Ee].includes(e2) ? $r : t2 === $r ? e2 === Ae ? Zr : ei : t2 === Zr ? Qr : ei;
        }
        function ui(e2, t2, n2, r2) {
          var i2 = function(e3) {
            return e3 instanceof DataView ? a(e3, 0, e3.byteLength) : e3;
          }(e2);
          return { name: ci(t2, n2, r2), value: i2, description: t2 === Ae ? fi(e2) : i2 };
        }
        function ci(e2, t2, n2) {
          var r2 = s(n2);
          if (e2 === Pe || 0 === t2.length) return r2;
          var i2 = s(t2);
          return "".concat(r2, " (").concat(i2, ")");
        }
        function fi(e2) {
          return fn("UTF-8", e2);
        }
        function si(e2, t2) {
          return "raw profile type exif" === e2.toLowerCase() && "exif" === t2.substring(1, 5);
        }
        function li(e2, t2) {
          return "raw profile type iptc" === e2.toLowerCase() && "iptc" === t2.substring(1, 5);
        }
        function di(e2) {
          return function(e3) {
            for (var t2 = new DataView(new ArrayBuffer(e3.length / 2)), n2 = 0; n2 < e3.length; n2 += 2) t2.setUint8(n2 / 2, parseInt(e3.substring(n2, n2 + 2), 16));
            return t2;
          }(e2.match(/\n(exif|iptc)\n\s*\d+\n([\s\S]*)$/)[2].replace(/\n/g, ""));
        }
        var pi = { read: function(e2, t2) {
          for (var n2 = {}, r2 = 0; r2 < t2.length; r2++) {
            var i2 = It.getLongAt(e2, t2[r2] + be), o2 = a(e2, t2[r2] + Ie, Se);
            o2 === we ? (n2["Pixels Per Unit X"] = mi(e2, t2[r2], i2), n2["Pixels Per Unit Y"] = gi(e2, t2[r2], i2), n2["Pixel Units"] = vi(e2, t2[r2], i2)) : o2 === xe && (n2["Modify Date"] = hi(e2, t2[r2], i2));
          }
          return n2;
        } };
        function mi(e2, t2, n2) {
          if (yi(e2, t2, n2, 0, 4)) {
            var r2 = It.getLongAt(e2, t2 + Ce + 0);
            return { value: r2, description: "" + r2 };
          }
        }
        function gi(e2, t2, n2) {
          if (yi(e2, t2, n2, 4, 4)) {
            var r2 = It.getLongAt(e2, t2 + Ce + 4);
            return { value: r2, description: "" + r2 };
          }
        }
        function vi(e2, t2, n2) {
          if (yi(e2, t2, n2, 8, 1)) {
            var r2 = It.getByteAt(e2, t2 + Ce + 8);
            return { value: r2, description: 1 === r2 ? "meters" : "Unknown" };
          }
        }
        function hi(e2, t2, n2) {
          if (yi(e2, t2, n2, 0, 7)) {
            var r2 = It.getShortAt(e2, t2 + Ce), i2 = It.getByteAt(e2, t2 + Ce + 2), o2 = It.getByteAt(e2, t2 + Ce + 3), a2 = It.getByteAt(e2, t2 + Ce + 4), u2 = It.getByteAt(e2, t2 + Ce + 5), c2 = It.getByteAt(e2, t2 + Ce + 6);
            return { value: [r2, i2, o2, a2, u2, c2], description: "".concat(Si(r2, 4), "-").concat(Si(i2, 2), "-").concat(Si(o2, 2), " ").concat(Si(a2, 2), ":").concat(Si(u2, 2), ":").concat(Si(c2, 2)) };
          }
        }
        function yi(e2, t2, n2, r2, i2) {
          return r2 + i2 <= n2 && t2 + Ce + r2 + i2 <= e2.byteLength;
        }
        function Si(e2, t2) {
          return "".concat("0".repeat(t2 - ("" + e2).length)).concat(e2);
        }
        var bi = { read: function(e2, t2) {
          var n2 = {}, r2 = It.getByteAt(e2, t2);
          return n2.Alpha = function(e3) {
            var t3 = 16 & e3;
            return { value: t3 ? 1 : 0, description: t3 ? "Yes" : "No" };
          }(r2), n2.Animation = function(e3) {
            var t3 = 2 & e3;
            return { value: t3 ? 1 : 0, description: t3 ? "Yes" : "No" };
          }(r2), n2.ImageWidth = Ui(e2, t2 + Ii), n2.ImageHeight = Ui(e2, t2 + Ci), n2;
        } }, Ii = 4, Ci = 7;
        function Ui(e2, t2) {
          var n2 = It.getByteAt(e2, t2) + 256 * It.getByteAt(e2, t2 + 1) + 65536 * It.getByteAt(e2, t2 + 2) + 1;
          return { value: n2, description: n2 + "px" };
        }
        var Pi = { read: function(e2) {
          return { "GIF Version": Ai(e2), "Image Width": Ei(e2), "Image Height": wi(e2), "Global Color Map": xi(e2), "Bits Per Pixel": Oi(e2), "Color Resolution Depth": Ti(e2) };
        } };
        function Ai(e2) {
          if (!(6 > e2.byteLength)) {
            var t2 = a(e2, 3, 3);
            return { value: t2, description: t2 };
          }
        }
        function Ei(e2) {
          if (!(8 > e2.byteLength)) {
            var t2 = e2.getUint16(6, 1);
            return { value: t2, description: "".concat(t2, "px") };
          }
        }
        function wi(e2) {
          if (!(10 > e2.byteLength)) {
            var t2 = e2.getUint16(8, 1);
            return { value: t2, description: "".concat(t2, "px") };
          }
        }
        function xi(e2) {
          if (!(11 > e2.byteLength)) {
            var t2 = (128 & e2.getUint8(10)) >>> 7;
            return { value: t2, description: 1 === t2 ? "Yes" : "No" };
          }
        }
        function Ti(e2) {
          if (!(11 > e2.byteLength)) {
            var t2 = 1 + ((112 & e2.getUint8(10)) >>> 4);
            return { value: t2, description: "".concat(t2, " ").concat(1 === t2 ? "bit" : "bits") };
          }
        }
        function Oi(e2) {
          if (!(11 > e2.byteLength)) {
            var t2 = 1 + (7 & e2.getUint8(10));
            return { value: t2, description: "".concat(t2, " ").concat(1 === t2 ? "bit" : "bits") };
          }
        }
        var Mi = [6, 7, 99], Fi = { get: function(e2, t2, n2) {
          if ((i2 = t2) && (void 0 === i2.Compression || Mi.includes(i2.Compression.value)) && i2.JPEGInterchangeFormat && i2.JPEGInterchangeFormat.value && i2.JPEGInterchangeFormatLength && i2.JPEGInterchangeFormatLength.value) {
            t2.type = "image/jpeg";
            var r2 = n2 + t2.JPEGInterchangeFormat.value;
            t2.image = e2.buffer.slice(r2, r2 + t2.JPEGInterchangeFormatLength.value), d(t2, "base64", function() {
              return p(this.image);
            });
          }
          var i2;
          return t2;
        } }, Ri = { get: function(e2, t2) {
          var n2 = {}, r2 = 0, i2 = ki(e2, "FocalLength", t2), o2 = ki(e2, "FocalLengthIn35mmFilm", t2), a2 = function(e3, t3) {
            if (e3 && t3) try {
              var n3 = t3 / (e3[0] / e3[1]);
              return { value: n3, description: n3.toFixed(1) };
            } catch (e4) {
            }
          }(i2, o2);
          a2 && (n2.ScaleFactorTo35mmEquivalent = a2, r2 = 1);
          var u2 = function(e3) {
            if (e3) try {
              var t3 = 2 * Math.atan(36 / (2 * e3)) * (180 / Math.PI);
              return { value: t3, description: t3.toFixed(1) + " deg" };
            } catch (e4) {
            }
          }(o2);
          if (u2 && (n2.FieldOfView = u2, r2 = 1), r2) return n2;
        } };
        function ki(e2, t2, n2) {
          return n2 && e2.exif && e2.exif[t2] ? e2.exif[t2].value : !n2 && e2[t2] ? e2[t2].value : void 0;
        }
        function Di(e2) {
          this.name = "MetadataMissingError", this.message = e2 || "No Exif data", this.stack = Error().stack;
        }
        Di.prototype = Error();
        var Ni = { MetadataMissingError: Di }, Li = { load: Bi, loadView: ji, errors: Ni }, _i = Ni;
        function Bi(e2) {
          var t2, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          return /* @__PURE__ */ function(e3) {
            return "string" == typeof e3;
          }(e2) ? (n2.async = 1, function(e3, t3) {
            return /^\w+:\/\//.test(e3) ? "undefined" != typeof fetch ? function(e4) {
              var t4 = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).length, n3 = { method: "GET" };
              return Number.isInteger(t4) && t4 >= 0 && (n3.headers = { range: "bytes=0-".concat(t4 - 1) }), fetch(e4, n3).then(function(e5) {
                return e5.arrayBuffer();
              });
            }(e3, t3) : function(e4) {
              var t4 = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).length;
              return new Promise(function(n3, r2) {
                var i2 = {};
                Number.isInteger(t4) && t4 >= 0 && (i2.headers = { range: "bytes=0-".concat(t4 - 1) });
                var o2 = function(e5) {
                  return /^https:\/\//.test(e5) ? require("https").get : require("http").get;
                }(e4);
                o2(e4, i2, function(e5) {
                  if (e5.statusCode >= 200 && e5.statusCode <= 299) {
                    var t5 = [];
                    e5.on("data", function(e6) {
                      return t5.push(Buffer.from(e6));
                    }), e5.on("error", function(e6) {
                      return r2(e6);
                    }), e5.on("end", function() {
                      return n3(Buffer.concat(t5));
                    });
                  } else r2("Could not fetch file: ".concat(e5.statusCode, " ").concat(e5.statusMessage)), e5.resume();
                }).on("error", function(e5) {
                  return r2(e5);
                });
              });
            }(e3, t3) : function(e4) {
              return /^data:[^;,]*(;base64)?,/.test(e4);
            }(e3) ? Promise.resolve(function(e4) {
              var t4 = e4.substring(e4.indexOf(",") + 1);
              if (-1 !== e4.indexOf(";base64")) {
                if ("undefined" != typeof atob) return Uint8Array.from(atob(t4), function(e5) {
                  return e5.charCodeAt(0);
                }).buffer;
                if ("undefined" == typeof Buffer) return;
                return "undefined" != typeof Buffer.from ? Buffer.from(t4, "base64") : new Buffer(t4, "base64");
              }
              var n3 = decodeURIComponent(t4);
              return "undefined" != typeof Buffer ? "undefined" != typeof Buffer.from ? Buffer.from(n3) : new Buffer(n3) : Uint8Array.from(n3, function(e5) {
                return e5.charCodeAt(0);
              }).buffer;
            }(e3)) : function(e4) {
              var t4 = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).length;
              return new Promise(function(n3, r2) {
                var i2 = function() {
                  try {
                    return require("fs");
                  } catch (e5) {
                    return;
                  }
                }();
                i2.open(e4, function(o2, a2) {
                  o2 ? r2(o2) : i2.stat(e4, function(o3, u2) {
                    if (o3) r2(o3);
                    else {
                      var c2 = Math.min(u2.size, void 0 !== t4 ? t4 : u2.size), f2 = Buffer.alloc(c2), s2 = { buffer: f2, length: c2 };
                      i2.read(a2, s2, function(t5) {
                        t5 ? r2(t5) : i2.close(a2, function(t6) {
                          t6 && console.warn("Could not close file ".concat(e4, ":"), t6), n3(f2);
                        });
                      });
                    }
                  });
                });
              });
            }(e3, t3);
          }(e2, n2).then(function(e3) {
            return Gi(e3, n2);
          })) : function(e3) {
            return "undefined" != typeof File && e3 instanceof File;
          }(e2) ? (n2.async = 1, (t2 = e2, new Promise(function(e3, n3) {
            var r2 = new FileReader();
            r2.onload = function(t3) {
              return e3(t3.target.result);
            }, r2.onerror = function() {
              return n3(r2.error);
            }, r2.readAsArrayBuffer(t2);
          })).then(function(e3) {
            return Gi(e3, n2);
          })) : Gi(e2, n2);
        }
        function Gi(e2, t2) {
          return function(e3) {
            try {
              return Buffer.isBuffer(e3);
            } catch (e4) {
              return 0;
            }
          }(e2) && (e2 = new Uint8Array(e2).buffer), ji(function(e3) {
            try {
              return new DataView(e3);
            } catch (t3) {
              return new i(e3);
            }
          }(e2), t2);
        }
        function ji(e2) {
          var t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : { expanded: 0, async: 0, includeUnknown: 0, domParser: void 0 }, n2 = t2.expanded, r2 = void 0 === n2 ? 0 : n2, i2 = t2.async, o2 = void 0 === i2 ? 0 : i2, a2 = t2.includeUnknown, u2 = void 0 === a2 ? 0 : a2, c2 = t2.domParser, f2 = void 0 === c2 ? void 0 : c2, d2 = 0, p2 = {}, m2 = [], g2 = et.parseAppMarkers(e2, o2), v2 = g2.fileType, y2 = g2.fileDataOffset, S2 = g2.jfifDataOffset, I2 = g2.tiffHeaderOffset, C2 = g2.iptcDataOffset, U2 = g2.xmpChunks, P2 = g2.iccChunks, A2 = g2.mpfDataOffset, E2 = g2.pngHeaderOffset, w2 = g2.pngTextChunks, x2 = g2.pngChunkOffsets, T2 = g2.vp8xChunkOffset, O2 = g2.gifHeaderOffset;
          if (h.USE_JPEG && h.USE_FILE && /* @__PURE__ */ function(e3) {
            return void 0 !== e3;
          }(y2)) {
            d2 = 1;
            var M2 = Wt.read(e2, y2);
            r2 ? p2.file = M2 : p2 = l({}, p2, M2);
          }
          if (h.USE_JPEG && h.USE_JFIF && /* @__PURE__ */ function(e3) {
            return void 0 !== e3;
          }(S2)) {
            d2 = 1;
            var F2 = Zt.read(e2, S2);
            r2 ? p2.jfif = F2 : p2 = l({}, p2, F2);
          }
          if (h.USE_EXIF && /* @__PURE__ */ function(e3) {
            return void 0 !== e3;
          }(I2)) {
            d2 = 1;
            var R2 = kt.read(e2, I2, u2), k2 = R2.tags, D2 = R2.byteOrder;
            if (k2.Thumbnail && (p2.Thumbnail = k2.Thumbnail, delete k2.Thumbnail), r2 ? (p2.exif = k2, function(e3) {
              if (e3.exif) {
                if (e3.exif.GPSLatitude && e3.exif.GPSLatitudeRef) try {
                  e3.gps = e3.gps || {}, e3.gps.Latitude = b(e3.exif.GPSLatitude.value), "S" === e3.exif.GPSLatitudeRef.value.join("") && (e3.gps.Latitude = -e3.gps.Latitude);
                } catch (e4) {
                }
                if (e3.exif.GPSLongitude && e3.exif.GPSLongitudeRef) try {
                  e3.gps = e3.gps || {}, e3.gps.Longitude = b(e3.exif.GPSLongitude.value), "W" === e3.exif.GPSLongitudeRef.value.join("") && (e3.gps.Longitude = -e3.gps.Longitude);
                } catch (e4) {
                }
                if (e3.exif.GPSAltitude && e3.exif.GPSAltitudeRef) try {
                  e3.gps = e3.gps || {}, e3.gps.Altitude = e3.exif.GPSAltitude.value[0] / e3.exif.GPSAltitude.value[1], 1 === e3.exif.GPSAltitudeRef.value && (e3.gps.Altitude = -e3.gps.Altitude);
                } catch (e4) {
                }
              }
            }(p2)) : p2 = l({}, p2, k2), h.USE_TIFF && h.USE_IPTC && k2["IPTC-NAA"] && !zi(C2)) {
              var N2 = sn.read(k2["IPTC-NAA"].value, 0, u2);
              r2 ? p2.iptc = N2 : p2 = l({}, p2, N2);
            }
            if (h.USE_TIFF && h.USE_XMP && k2.ApplicationNotes && !Vi(U2)) {
              var L2 = On.read(s(k2.ApplicationNotes.value), void 0, f2);
              r2 ? p2.xmp = L2 : (delete L2._raw, p2 = l({}, p2, L2));
            }
            if (h.USE_PHOTOSHOP && k2.ImageSourceData && k2.PhotoshopSettings) {
              var _2 = dr.read(k2.PhotoshopSettings.value, u2);
              r2 ? p2.photoshop = _2 : p2 = l({}, p2, _2);
            }
            if (h.USE_TIFF && h.USE_ICC && k2.ICC_Profile && !Hi(P2)) {
              var B2 = Ir.read(k2.ICC_Profile.value, [{ offset: 0, length: k2.ICC_Profile.value.length, chunkNumber: 1, chunksTotal: 1 }]);
              r2 ? p2.icc = B2 : p2 = l({}, p2, B2);
            }
            if (h.USE_MAKER_NOTES && k2.MakerNote) {
              if (function(e3) {
                return e3.Make && e3.Make.value && Array.isArray(e3.Make.value) && "Canon" === e3.Make.value[0] && e3.MakerNote && e3.MakerNote.__offset;
              }(k2)) {
                var G2 = kr.read(e2, I2, k2.MakerNote.__offset, D2, u2);
                r2 ? p2.makerNotes = G2 : p2 = l({}, p2, G2);
              } else if (function(e3) {
                return e3.MakerNote.value.length > 7 && "PENTAX " === s(e3.MakerNote.value.slice(0, 7)) && e3.MakerNote.__offset;
              }(k2)) {
                var j2 = Lr.read(e2, I2, k2.MakerNote.__offset, u2);
                r2 ? p2.makerNotes = j2 : p2 = l({}, p2, j2);
              }
            }
            k2.MakerNote && delete k2.MakerNote.__offset;
          }
          if (h.USE_JPEG && h.USE_IPTC && zi(C2)) {
            d2 = 1;
            var z2 = sn.read(e2, C2, u2);
            r2 ? p2.iptc = z2 : p2 = l({}, p2, z2);
          }
          if (h.USE_XMP && Vi(U2)) {
            d2 = 1;
            var V2 = On.read(e2, U2, f2);
            r2 ? p2.xmp = V2 : (delete V2._raw, p2 = l({}, p2, V2));
          }
          if ((h.USE_JPEG || h.USE_WEBP) && h.USE_ICC && Hi(P2)) {
            d2 = 1;
            var H2 = Ir.read(e2, P2, o2);
            H2 instanceof Promise ? m2.push(H2.then(te2)) : te2(H2);
          }
          if (h.USE_MPF && /* @__PURE__ */ function(e3) {
            return void 0 !== e3;
          }(A2)) {
            d2 = 1;
            var W2 = _t.read(e2, A2, u2);
            r2 ? p2.mpf = W2 : p2 = l({}, p2, W2);
          }
          if (h.USE_PNG && h.USE_PNG_FILE && void 0 !== E2) {
            d2 = 1;
            var X2 = Gr.read(e2, E2);
            r2 ? (p2.png = p2.png ? l({}, p2.png, X2) : X2, p2.pngFile = X2) : p2 = l({}, p2, X2);
          }
          if (h.USE_PNG && /* @__PURE__ */ function(e3) {
            return void 0 !== e3;
          }(w2)) {
            d2 = 1;
            var J2 = Kr.read(e2, w2, o2, u2), Y2 = J2.readTags, K2 = J2.readTagsPromise;
            ne2(Y2), K2 && m2.push(K2.then(function(e3) {
              return e3.forEach(ne2);
            }));
          }
          if (h.USE_PNG && /* @__PURE__ */ function(e3) {
            return void 0 !== e3;
          }(x2)) {
            d2 = 1;
            var q2 = pi.read(e2, x2);
            r2 ? p2.png = p2.png ? l({}, p2.png, q2) : q2 : p2 = l({}, p2, q2);
          }
          if (h.USE_WEBP && /* @__PURE__ */ function(e3) {
            return void 0 !== e3;
          }(T2)) {
            d2 = 1;
            var $2 = bi.read(e2, T2);
            r2 ? p2.riff = p2.riff ? l({}, p2.riff, $2) : $2 : p2 = l({}, p2, $2);
          }
          if (h.USE_GIF && /* @__PURE__ */ function(e3) {
            return void 0 !== e3;
          }(O2)) {
            d2 = 1;
            var Z2 = Pi.read(e2, O2);
            r2 ? p2.gif = p2.gif ? l({}, p2.gif, Z2) : Z2 : p2 = l({}, p2, Z2);
          }
          var Q2 = Ri.get(p2, r2);
          Q2 && (r2 ? p2.composite = Q2 : p2 = l({}, p2, Q2));
          var ee2 = (h.USE_JPEG || h.USE_WEBP) && h.USE_EXIF && h.USE_THUMBNAIL && Fi.get(e2, p2.Thumbnail, I2);
          if (ee2 ? (d2 = 1, p2.Thumbnail = ee2) : delete p2.Thumbnail, v2 && (r2 ? (p2.file || (p2.file = {}), p2.file.FileType = v2) : p2.FileType = v2, d2 = 1), !d2) throw new Ni.MetadataMissingError();
          return o2 ? Promise.all(m2).then(function() {
            return p2;
          }) : p2;
          function te2(e3) {
            r2 ? p2.icc = e3 : p2 = l({}, p2, e3);
          }
          function ne2(e3) {
            if (r2) {
              for (var t3 = 0, n3 = ["exif", "iptc"]; t3 < n3.length; t3++) {
                var i3 = n3[t3], o3 = "__".concat(i3);
                e3[o3] && (p2[i3] = p2[i3] ? l({}, p2.exif, e3[o3]) : e3[o3], delete e3[o3]);
              }
              p2.png = p2.png ? l({}, p2.png, e3) : e3, p2.pngText = p2.pngText ? l({}, p2.png, e3) : e3;
            } else delete (p2 = l({}, p2, e3.__exif ? e3.__exif : {}, e3.__iptc ? e3.__iptc : {}, e3)).__exif, delete p2.__iptc;
          }
        }
        function zi(e2) {
          return void 0 !== e2;
        }
        function Vi(e2) {
          return Array.isArray(e2) && e2.length > 0;
        }
        function Hi(e2) {
          return Array.isArray(e2) && e2.length > 0;
        }
        return t;
      }();
    });
  }
});

// node_modules/commander/esm.mjs
var import_index = __toESM(require_commander(), 1);
var {
  program,
  createCommand,
  createArgument,
  createOption,
  CommanderError,
  InvalidArgumentError,
  InvalidOptionArgumentError,
  // deprecated old name
  Command,
  Argument,
  Option,
  Help
} = import_index.default;

// scripts/import-comfy.ts
var import_fs2 = __toESM(require("fs"), 1);
var import_path2 = __toESM(require("path"), 1);

// node_modules/uuid/dist/esm/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/uuid/dist/esm/rng.js
var import_crypto = require("crypto");
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    (0, import_crypto.randomFillSync)(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm/v7.js
var _state = {};
function v7(options, buf, offset) {
  let bytes;
  if (options) {
    bytes = v7Bytes(options.random ?? options.rng?.() ?? rng(), options.msecs, options.seq, buf, offset);
  } else {
    const now = Date.now();
    const rnds = rng();
    updateV7State(_state, now, rnds);
    bytes = v7Bytes(rnds, _state.msecs, _state.seq, buf, offset);
  }
  return buf ?? unsafeStringify(bytes);
}
function updateV7State(state, now, rnds) {
  state.msecs ??= -Infinity;
  state.seq ??= 0;
  if (now > state.msecs) {
    state.seq = rnds[6] << 23 | rnds[7] << 16 | rnds[8] << 8 | rnds[9];
    state.msecs = now;
  } else {
    state.seq = state.seq + 1 | 0;
    if (state.seq === 0) {
      state.msecs++;
    }
  }
  return state;
}
function v7Bytes(rnds, msecs, seq, buf, offset = 0) {
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  if (!buf) {
    buf = new Uint8Array(16);
    offset = 0;
  } else {
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
  }
  msecs ??= Date.now();
  seq ??= rnds[6] * 127 << 24 | rnds[7] << 16 | rnds[8] << 8 | rnds[9];
  buf[offset++] = msecs / 1099511627776 & 255;
  buf[offset++] = msecs / 4294967296 & 255;
  buf[offset++] = msecs / 16777216 & 255;
  buf[offset++] = msecs / 65536 & 255;
  buf[offset++] = msecs / 256 & 255;
  buf[offset++] = msecs & 255;
  buf[offset++] = 112 | seq >>> 28 & 15;
  buf[offset++] = seq >>> 20 & 255;
  buf[offset++] = 128 | seq >>> 14 & 63;
  buf[offset++] = seq >>> 6 & 255;
  buf[offset++] = seq << 2 & 255 | rnds[10] & 3;
  buf[offset++] = rnds[11];
  buf[offset++] = rnds[12];
  buf[offset++] = rnds[13];
  buf[offset++] = rnds[14];
  buf[offset++] = rnds[15];
  return buf;
}
var v7_default = v7;

// node_modules/chalk/source/vendor/ansi-styles/index.js
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
var styles = {
  modifier: {
    reset: [0, 0],
    // 21 isn't widely supported and 22 does the same thing
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29]
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    // Bright color
    blackBright: [90, 39],
    gray: [90, 39],
    // Alias of `blackBright`
    grey: [90, 39],
    // Alias of `blackBright`
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39]
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    // Bright color
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    // Alias of `bgBlackBright`
    bgGrey: [100, 49],
    // Alias of `bgBlackBright`
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49]
  }
};
var modifierNames = Object.keys(styles.modifier);
var foregroundColorNames = Object.keys(styles.color);
var backgroundColorNames = Object.keys(styles.bgColor);
var colorNames = [...foregroundColorNames, ...backgroundColorNames];
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value(hex) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          /* eslint-disable no-bitwise */
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
          /* eslint-enable no-bitwise */
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles;
}
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;

// node_modules/chalk/source/vendor/supports-color/index.js
var import_node_process = __toESM(require("node:process"), 1);
var import_node_os = __toESM(require("node:os"), 1);
var import_node_tty = __toESM(require("node:tty"), 1);
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : import_node_process.default.argv) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
var { env } = import_node_process.default;
var flagForceColor;
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
  flagForceColor = 0;
} else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
  flagForceColor = 1;
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== void 0) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === void 0) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (import_node_process.default.platform === "win32") {
    const osRelease = import_node_os.default.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((key) => key in env)) {
      return 3;
    }
    if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version2 = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version2 >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel(level);
}
var supportsColor = {
  stdout: createSupportsColor({ isTTY: import_node_tty.default.isatty(1) }),
  stderr: createSupportsColor({ isTTY: import_node_tty.default.isatty(2) })
};
var supports_color_default = supportsColor;

// node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.slice(endIndex, index) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue += string.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// node_modules/chalk/source/index.js
var { stdout: stdoutColor, stderr: stderrColor } = supports_color_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
];
var styles2 = /* @__PURE__ */ Object.create(null);
var applyOptions = (object, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === void 0 ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk2 = (...strings) => strings.join(" ");
  applyOptions(chalk2, options);
  Object.setPrototypeOf(chalk2, createChalk.prototype);
  return chalk2;
};
function createChalk(options) {
  return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles2[styleName] = {
    get() {
      const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    }
  };
}
styles2.visible = {
  get() {
    const builder = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  }
};
var getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level === "ansi256") {
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    }
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex") {
    return getModelAnsi("rgb", level, type, ...ansi_styles_default.hexToRgb(...arguments_));
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles2[model] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles2[bgModel] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
}
var proto = Object.defineProperties(() => {
}, {
  ...styles2,
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level) {
      this[GENERATOR].level = level;
    }
  }
});
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === void 0) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
};
var createBuilder = (self2, _styler, _isEmpty) => {
  const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self2;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self2, string) => {
  if (self2.level <= 0 || !string) {
    return self2[IS_EMPTY] ? "" : string;
  }
  let styler = self2[STYLER];
  if (styler === void 0) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== void 0) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf("\n");
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles2);
var chalk = createChalk();
var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// dist/EventEmitter.js
var EventEmitter = class {
  callbacks = {};
  constructor() {
  }
  on(event, cb) {
    if (!this.callbacks[event])
      this.callbacks[event] = [];
    this.callbacks[event].push(cb);
  }
  off(event, cb) {
    if (!this.callbacks[event])
      return;
    this.callbacks[event].splice(this.callbacks[event].indexOf(cb), 1);
  }
  emit(event, ...data) {
    let cbs = this.callbacks[event];
    if (cbs) {
      cbs.forEach((cb) => cb(...data));
    }
  }
};

// dist/ComfyInterface.js
var unimportant = source_default.hex("#888");
var error = source_default.hex("#f00").bgWhite;
var warning = source_default.hex("#fa0");
var success = source_default.hex("#0b0").bgBlack;
var DEBUG = false;
var ComfyWebsocketInstance = class _ComfyWebsocketInstance {
  socket;
  events;
  constructor(socket) {
    this.socket = socket;
    this.events = new EventEmitter();
  }
  static async connect(url = "ws://localhost:8188/") {
    if (!url.endsWith("/"))
      url += "/";
    const socket = new WebSocket(url + `ws?clientId=${v7_default()}`);
    const result = new _ComfyWebsocketInstance(socket);
    let { promise, reject, resolve } = Promise.withResolvers();
    socket.addEventListener("open", (event) => {
      if (DEBUG)
        console.log("WebSocket connection established!");
      resolve();
    });
    socket.addEventListener("message", (event) => {
      if (DEBUG)
        console.log("Message from server: ", event.data);
      const data = JSON.parse(event.data);
      result.events.emit("message", data);
      result.events.emit(data.type, data.data);
    });
    socket.addEventListener("close", (event) => {
      if (DEBUG)
        console.log("WebSocket connection closed:", event.code, event.reason);
    });
    socket.addEventListener("error", (error5) => {
      console.error("WebSocket error:", error5);
    });
    await promise;
    return result;
  }
};
var ComfyInterface = class {
  url;
  _ws;
  constructor(url = "http://localhost:8188") {
    if (url.endsWith("/")) {
      url = url.slice(0, url.length - 1);
    }
    this.url = url;
  }
  /**
   * Create a Websocket connection to Comfy UI.
   * This happens automatically when needed.
   */
  async initializeWebsocket() {
    this._ws = await ComfyWebsocketInstance.connect(this.url);
  }
  /**
   * Generic GET request to the Comfy Server.
   * Expects and parses a Json Response.
   * @param endpoint
   * @returns
   */
  async getJson(endpoint) {
    const response = await fetch(`${this.url}${endpoint}`);
    return await response.json();
  }
  /**
   * Generic POST request to the Comfy Server.
   * Expects and parses a Json Response.
   * @param endpoint
   * @param data
   * @returns
   */
  async postJson(endpoint, data) {
    return (await this.post(endpoint, data)).json();
  }
  /**
   * Generic POST request to the Comfy Server.
   * Returns the raw response object.
   * @param endpoint
   * @param data
   * @returns
   */
  async post(endpoint, data) {
    return await fetch(`${this.url}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  }
  /**
   * Sends a generic POST request to the Comfy Server.
   * Data is represented as a FormData object, which makes including
   * Media data easier.
   * Returns a parsed json object.
   * @param endpoint
   * @param formData
   * @returns
   */
  async postFormData(endpoint, formData) {
    const response = await fetch(`${this.url}${endpoint}`, {
      method: "POST",
      body: formData
    });
    return await response.json();
  }
  /**
   * Fetch the Node Definition data for all node types
   */
  async getNodeTypes() {
    return this.getJson("/object_info");
  }
  /**
   * Get queue history
   */
  async getHistory() {
    return this.getJson("/history");
  }
  /**
   * Get specific history entry by ID
   */
  async getHistoryItem(id) {
    return Object.values(await this.getJson(`/history/${id}`))[0];
  }
  /**
   * Get image by filename
   */
  async getImage(filename, type, subfolder = "") {
    const response = await fetch(`${this.url}/view?filename=${encodeURIComponent(filename)}&type=${type}&subfolder=${subfolder}`);
    return await response.blob();
  }
  /**
   * Get list of extensions
   */
  async getExtensions() {
    return this.getJson("/extensions");
  }
  /**
   * Get list of embeddings
   */
  async getEmbeddings() {
    return this.getJson("/embeddings");
  }
  /**
   * Get current queue
   */
  async getQueue() {
    return this.getJson("/queue");
  }
  /**
   * Get system statistics
   */
  async getSystemStats() {
    return this.getJson("/system_stats");
  }
  /**
   * Returns all nodes which the input nodes require to work, including themselves.
   * @param nodes
   */
  _resolveDependencies(nodes) {
    let result = /* @__PURE__ */ new Set([...nodes]);
    let frontier = [...nodes];
    let node;
    while (node = frontier.pop()) {
      for (const key in node.inputs) {
        const input = node.inputs[key];
        if (input.target) {
          const targetNode = input.target.node;
          if (!result.has(targetNode)) {
            frontier.push(targetNode);
            result.add(targetNode);
          }
        }
      }
    }
    return [...result];
  }
  /**
   * Turns an array of connected Comfy Nodes into a form which can be sent to comfyui via the api.
   * @param nodes
   * @returns
   */
  _generateJsonPrompt(nodes) {
    return Object.fromEntries(this._resolveDependencies(nodes).map((x) => [x.id, x.toJson()]));
  }
  /**
   * Execute a prompt
   * @param prompt The prompt data to execute.
   * @param wait Wait until the prompt is done.
   */
  async executePrompt(nodes, wait = false) {
    if (wait) {
      let unsubscribe = function() {
        ws.events.off("progress", on_progress);
        ws.events.off("status", on_status);
      }, on_progress = function(data) {
        if (result.prompt_id === data.prompt_id) {
          if (wait === "print") {
            const progress = data.value / data.max;
            console.log(unimportant(`${(progress * 100).toFixed(2)}% - ${data.value} / ${data.max}`));
          }
        }
      };
      if (!this._ws)
        await this.initializeWebsocket();
      const ws = this._ws;
      let result = await this.postJson("/prompt", { prompt: this._generateJsonPrompt(nodes) });
      if (result.error) {
        console.log(error(`${result.error.type}: ${result.error.message} (${result.error.details}).`));
        return result;
      }
      const { promise, resolve, reject } = Promise.withResolvers();
      const self2 = this;
      async function on_status(data) {
        let hist = await self2.getHistoryItem(result.prompt_id);
        if (DEBUG) {
          console.log("History is ");
          console.log(hist);
        }
        if (hist?.status.completed) {
          unsubscribe();
          resolve();
        }
      }
      ws.events.on("progress", on_progress);
      ws.events.on("status", on_status);
      await promise;
      if (wait === "print")
        console.log(success(`Prompt Finished (${result.prompt_id})`));
      return result;
    }
    return await this.postJson("/prompt", { prompt: this._generateJsonPrompt(nodes) });
  }
  /**
   * Interrupt current execution
   */
  async interrupt() {
    await this.post("/interrupt", {});
  }
  /**
   * Clear queue
   */
  async clearQueue() {
    await this.post("/queue", { clear: true });
  }
  /**
   * Delete items from queue
   * @param ids Array of queue item IDs to delete
   */
  async deleteQueueItems(ids) {
    await this.postJson("/queue", { delete: ids });
  }
  /**
   * Clear history
   */
  async clearHistory() {
    await this.post("/history", { clear: true });
  }
  /**
   * Delete items from history
   * @param ids Array of history item IDs to delete
   */
  async deleteHistoryItems(ids) {
    await this.postJson("/history", { delete: ids });
  }
  /**
   * Upload an image
   * @param image File, Blob, Buffer, or string path containing the image
   * @param type 'image' or 'mask'
   */
  async uploadImage(image, type = "image") {
    const formData = new FormData();
    let imageData;
    if (typeof image === "string") {
      if (typeof window === "undefined") {
        const fs4 = await import("fs");
        const { promisify } = await import("util");
        const readFile = promisify(fs4.readFile);
        const buffer = await readFile(image);
        imageData = new Blob([buffer]);
      } else {
        const response = await fetch(image);
        if (!response.ok)
          throw new Error(`Failed to fetch image from ${image}`);
        imageData = await response.blob();
      }
    } else if (image instanceof Buffer) {
      imageData = new Blob([image]);
    } else {
      imageData = image;
    }
    formData.append(type, imageData);
    return this.postFormData(`/upload/${type}`, formData);
  }
  /**
   * Call this to close all connections.
   * If you forget to call quit(), and you use websockets,
   * then the program won't close by itself until this is called.
   */
  quit() {
    if (this._ws) {
      this._ws.socket.close();
      this._ws = void 0;
    }
  }
};

// scripts/shared.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_crypto2 = __toESM(require("crypto"), 1);
var import_readline = __toESM(require("readline"), 1);
function ensure_directory(path4) {
  if (!import_fs.default.existsSync(path4)) {
    import_fs.default.mkdirSync(path4, { recursive: true });
  }
}
async function sha256sum(opts) {
  const hash = import_crypto2.default.createHash("sha256");
  if ("filename" in opts) {
    const filename = opts["filename"];
    const input = import_fs.default.createReadStream(filename);
    return new Promise((resolve) => {
      input.on("readable", () => {
        const data = input.read();
        if (data)
          hash.update(data);
        else
          resolve(hash.digest("hex"));
      });
    });
  }
  hash.update(opts.value);
  return hash.digest("hex");
}
function clean_key(key) {
  key = key.replace(/[\s]/g, "").replace("+", "Plus");
  if (key.length === 0) {
    return "_";
  }
  const validFirstChar = /^[\p{L}_$]/u;
  const validRestChars = /^[\p{L}\p{N}_$]$/u;
  let firstChar = key.charAt(0);
  let restChars = key.slice(1);
  if (!validFirstChar.test(firstChar)) {
    firstChar = "_";
  }
  const processedRest = Array.from(restChars).map((char) => validRestChars.test(char) ? char : "_").join("");
  const candidate = firstChar + processedRest;
  const reservedKeywords = /* @__PURE__ */ new Set([
    "abstract",
    "async",
    "await",
    "any",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "new",
    "null",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "as",
    "implements",
    "interface",
    "let",
    "package",
    "private",
    "protected",
    "public",
    "static",
    "yield",
    "boolean",
    "constructor",
    "declare",
    "get",
    "module",
    "require",
    "number",
    "set",
    "string",
    "symbol",
    "type",
    "from",
    "of",
    "is",
    "namespace",
    "never",
    "unknown",
    "readonly",
    "object",
    "undefined",
    "bigint"
  ]);
  return reservedKeywords.has(candidate) ? `_${candidate}` : candidate;
}
function get_node_path(import_path4, node) {
  let key = clean_key(node.name);
  let full_path = import_path4;
  if (node.category) {
    let path_segments = node.category.split("/");
    for (let i = 0; i < path_segments.length; i++) {
      let partial_path = import_path.default.join(import_path4, ...path_segments.slice(0, i + 1));
      ensure_directory(partial_path);
    }
    full_path = import_path.default.join(import_path4, ...path_segments);
  }
  full_path = import_path.default.join(full_path, key + ".ts");
  return full_path;
}
function sort_nodes_topologically(workflow) {
  const nodeIds = Object.keys(workflow);
  const visited = /* @__PURE__ */ new Set();
  const tempVisited = /* @__PURE__ */ new Set();
  const sortedNodes = [];
  function visit(nodeId) {
    if (tempVisited.has(nodeId)) {
      throw new Error(`Cyclic dependency detected involving node ${nodeId}`);
    }
    if (visited.has(nodeId)) return;
    tempVisited.add(nodeId);
    const node = workflow[nodeId];
    const dependencies = /* @__PURE__ */ new Set();
    for (const inputValue of Object.values(node.inputs)) {
      if (Array.isArray(inputValue) && inputValue.length === 2 && typeof inputValue[0] === "string") {
        dependencies.add(inputValue[0]);
      }
    }
    dependencies.forEach((depId) => {
      if (workflow[depId]) {
        visit(depId);
      }
    });
    tempVisited.delete(nodeId);
    visited.add(nodeId);
    sortedNodes.push(nodeId);
  }
  nodeIds.forEach((nodeId) => {
    if (!visited.has(nodeId)) {
      visit(nodeId);
    }
  });
  return sortedNodes;
}
function write_file_with_confirmation(output_path, content, fallback = false) {
  if (import_fs.default.existsSync(output_path)) {
    const rl = import_readline.default.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(warning2(`File "${output_path}" already exists. Overwrite? (${fallback ? "Y" : "y"}/${!fallback ? "N" : "n"})`), (answer) => {
      rl.close();
      if (answer === "") {
        if (fallback)
          answer = "y";
      }
      if (answer.toLowerCase() === "y") {
        import_fs.default.writeFileSync(output_path, content);
        console.log(success2(`File "${output_path}" has been overwritten.`));
      } else
        console.log(error2(`File "${output_path}" was not overwritten.`));
    });
  } else {
    import_fs.default.writeFileSync(output_path, content);
    console.log(success2(`File "${output_path}" has been created.`));
  }
}
async function try_all(fns) {
  for (let fn of fns) {
    try {
      let res = fn();
      if (res instanceof Promise) {
        let failed = false;
        res.catch(() => failed = true);
        let real_res = await res;
        if (!failed)
          return real_res;
      } else {
        return res;
      }
    } catch (e) {
    }
  }
  return null;
}
var unimportant2 = source_default.hex("#888");
var error2 = source_default.hex("#f00").bgWhite;
var warning2 = source_default.hex("#fa0");
var success2 = source_default.hex("#0b0").bgBlack;

// scripts/import-comfy.ts
var import_console = require("console");
var import_readline2 = __toESM(require("readline"), 1);
var import_nodes_command = new Command("nodes").description("Import and transform all nodes from the API to a local directory as typescript classes.\nYou need those to write any code using comfy-code.\nMake sure to rerun this command every time your ComfyUI changes, for example when you install or update nodes.\nThis command will not delete files in the target directory, but it will replace them if necessary.\nIf you find yourself with deprecated classes for nodes you have since uninstalled, you can delete the imports folder and run this command again for a fresh import.").option("-p, --port <number>", "Port number", "8188").option("-u, --url <string>", "Server URL", "http://127.0.0.1").option("-o, --output <path>", "Output directory", "./imports/").option("-y, --override", "Override all existing files imported files.", false).action(run_import_nodes);
async function run_import_nodes(options) {
  console.log(unimportant2(JSON.stringify(options, void 0, 2)));
  const PORT = options.port;
  const URL = options.url;
  const output_path = options.output;
  let override = options.override;
  console.log(`Server URL: ${URL}`);
  console.log(`Port: ${PORT}`);
  console.log(`Output path: ${output_path}`);
  const comfy = new ComfyInterface(`${URL}:${PORT}`);
  const res = await comfy.getNodeTypes();
  if (!import_fs2.default.existsSync(output_path)) {
    const rl = import_readline2.default.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    await new Promise((resolve, reject) => {
      rl.question(warning2(`Directory "${output_path}" does not exist. Would you like to create it? (Y/n)`), (answer) => {
        rl.close();
        if (answer.toLowerCase() === "n")
          process.exit();
        import_fs2.default.mkdirSync(output_path);
        console.log(success2(`Directory "${output_path}" has been created.`));
        resolve();
      });
    });
  }
  async function generate_real_index(dirPath, relativePath = "") {
    const result = /* @__PURE__ */ new Map();
    const entries = await import_fs2.default.promises.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = import_path2.default.join(dirPath, entry.name);
      const currentRelativePath = import_path2.default.join(relativePath, entry.name);
      if (entry.isDirectory()) {
        const subDirResults = await generate_real_index(fullPath, currentRelativePath);
        subDirResults.forEach((hash, filePath) => result.set(filePath, hash));
      } else if (entry.isFile()) {
        try {
          const hash = await sha256sum({ filename: fullPath });
          result.set(currentRelativePath, hash);
        } catch (error5) {
          result.set(currentRelativePath, "NULL");
        }
      }
    }
    return result;
  }
  const real_current_index = await generate_real_index(output_path);
  let stored_old_index = null;
  try {
    let old_index_data = import_fs2.default.readFileSync(import_path2.default.join(output_path, "index.json"), { encoding: "utf-8" });
    stored_old_index = new Map(Object.entries(JSON.parse(old_index_data)));
  } catch (e) {
  }
  ;
  const locked_files = /* @__PURE__ */ new Map();
  if (stored_old_index) {
    for (let [expected_file, expected_hash] of stored_old_index) {
      if (!real_current_index.has(expected_file))
        continue;
      const real_old_hash = real_current_index.get(expected_file);
      if (real_old_hash == "NULL") {
        continue;
      }
      if (
        // if any and all files should be overridden, just delete them and recreate them later
        !override && real_old_hash !== expected_hash
      ) {
        await new Promise((resolve, reject) => {
          const rl = import_readline2.default.createInterface({
            input: process.stdin,
            output: process.stdout
          });
          rl.question(warning2(`File "${expected_file}" was manually changed since the last import. Should this importer delete or override it? (Y/n/y!)`), (answer) => {
            rl.close();
            if (answer.toLowerCase() === "y!") {
              override = true;
              answer = "y";
            }
            if (answer === "")
              answer = "y";
            if (answer.toLowerCase() === "y") {
              import_fs2.default.rmSync(import_path2.default.join(output_path, expected_file));
              console.log(success2(`File "${import_path2.default.join(output_path, expected_file)}" has been discarded.`));
            } else {
              locked_files.set(import_path2.default.join(output_path, expected_file), true);
              console.log((0, import_console.error)(`File "${import_path2.default.join(output_path, expected_file)}" will not be imported.`));
            }
            resolve();
          });
        });
      } else {
        try {
          import_fs2.default.rmSync(import_path2.default.join(output_path, expected_file));
          console.log(success2(`Changes in "${import_path2.default.join(output_path, expected_file)}" have been discarded.`));
        } catch (e) {
        }
      }
    }
  }
  const new_index = /* @__PURE__ */ new Map();
  for (let key in res) {
    const v = res[key];
    const clean_key2 = clean_key(key);
    let full_path = get_node_path(output_path, v);
    let relative_path = import_path2.default.relative(output_path, full_path);
    if (locked_files.has(full_path)) {
      new_index.set(
        relative_path,
        stored_old_index.get(relative_path)
      );
      continue;
    }
    const outputs = v.output.map((x, i) => {
      return {
        type: x,
        label: v.output_name[i],
        is_list: v.output_is_list[i]
      };
    });
    const inputs = [
      ...Object.entries(v.input.required ?? {}).map((v2) => [...v2, true]),
      ...Object.entries(v.input.optional ?? {}).map((v2) => [...v2, false])
    ].map(([k, opts, required]) => {
      if (typeof opts === "string") {
        return {
          name: k,
          type: opts,
          required
        };
      } else if (Array.isArray(opts)) {
        if (opts.length === 0) {
          return {
            name: k,
            type: k,
            required
          };
        }
        const is_enum = Array.isArray(opts[0]);
        if (opts.length === 1) {
          return {
            name: k,
            type: opts[0],
            required: is_enum ? false : required
          };
        }
        if (opts.length > 1) {
          return {
            name: k,
            type: opts[0],
            ...opts[1],
            required: is_enum ? false : "default" in opts[1] ? false : required
          };
        }
      }
      console.log(opts);
      throw new Error("wtf");
    });
    try {
      let output_to_type = function(x) {
        let type;
        if (typeof x.type === "string") {
          type = "'" + x.type.replace("'", "\\'") + "'";
        } else {
          type = x.type.map((x2) => "'" + x2.replace("'", "\\'") + "'").join(" | ");
        }
        return type;
      }, input_to_type = function(x) {
        let _type = x.type;
        let type;
        if (typeof _type === "string") {
          if (_type === "TEXT" || _type === "STRING")
            type = "string";
          else if (_type === "BOOLEAN")
            type = "boolean";
          else if (_type === "NUMBER" || _type === "INTEGER" || _type === "FLOAT" || _type === "INT")
            type = "number";
          else
            type = "'" + _type.replace("'", "\\'") + "'";
        } else {
          if (_type.length === 0) {
            type = "any";
          } else
            type = _type.map((x2) => {
              if (typeof x2 === "string") {
                if (x2 === "TEXT" || x2 === "STRING")
                  return "string";
                return "'" + x2.replace("'", "\\'") + "'";
              } else if (typeof x2 === "number")
                return x2.toString();
              else
                return "any";
            }).join(" | ");
        }
        return type;
      };
      const outputs_str = outputs.length > 0 ? `Object.fromEntries(this._outputs.map((x, i) => [x.label, x])) as {
        ${outputs.map((x) => x.label + ": ComfyOutput<" + output_to_type(x) + ">").join(",\n")}
    }` : `{}`;
      const full_output = `
import { ComfyNode, ComfyOutput, ComfyInput } from 'comfy-code';            
            
export class ${clean_key2} extends ComfyNode
{
    classType = '${key.replace("'", "\\'")}';

    _outputs = [
    ${outputs.map((x, i) => {
        return `new ComfyOutput<${output_to_type(x)}>(this, ${i}, "${x.label.replace("'", "\\'")}")`;
      }).join(",\n")}
    ] as const;

    outputs = ${outputs_str};

    _inputs = [
    ${inputs.map((x, i) => {
        return `new ComfyInput<${input_to_type(x)}>(this, ${i}, "${x.name.replace("'", "\\'")}" ${"default" in x ? `, ${JSON.stringify(x.default)}` : Array.isArray(x.type) ? `, ${JSON.stringify(x.type[0])}` : ""})`;
      }).join(",\n")}
    ] as const;

    inputs = Object.fromEntries(this._inputs.map((x, i) => [x.label, x])) as {
        ${inputs.map((x) => `"${x.name}": ComfyInput<` + input_to_type(x) + ">").join(",\n")}
    };
    
    constructor(initial_values?: {${inputs.map((x) => `"${x.name}"` + (!x.required ? "?" : "") + ": ComfyOutput<" + input_to_type(x) + "> | " + input_to_type(x)).join(",\n")}})
    {
        super();
        this.initialize(initial_values);
    }
}
`;
      import_fs2.default.writeFileSync(full_path, full_output);
      new_index.set(import_path2.default.relative(output_path, full_path), await sha256sum({ value: full_output }));
    } catch (e) {
      console.log(key);
      console.log(v.input.required);
      console.log((0, import_console.error)("Uncaught error, see above."));
      throw e;
    }
  }
  console.log(success2(`Created all ${Object.keys(res).length} classes.`));
  import_fs2.default.writeFileSync(import_path2.default.join(output_path, "index.json"), JSON.stringify(Object.fromEntries(new_index.entries())));
}

// scripts/import-comfy-workflow.ts
var import_fs3 = __toESM(require("fs"), 1);
var import_path3 = __toESM(require("path"), 1);
var import_exifreader = __toESM(require_exif_reader(), 1);
var import_console2 = require("console");
var import_workflow_command = new Command("workflow").description("Extract a prompt graph from a json file or an (animated) image and then save the graph in the form of a comfy-code typescript script.\nUseful for quick prototyping.\n").requiredOption("-i, --input <path>", "Workflow file path").option("-p, --port <number>", "Port number", "8188").option("-u, --url <string>", "Server URL", "http://127.0.0.1").option("-o, --output <path>", "Output file path", "./workflows/workflow.ts").option("-m, --imports <path>", "Import path (Relative to the workflow file)", "./imports/").option("-f, --full", "Full template, such that running the resulting file runs the workflow.", false).option("-y, --override", "Override any existing file without asking.", false).action(run_import_workflow);
async function run_import_workflow(options) {
  console.log(unimportant2(JSON.stringify(options, void 0, 2)));
  const PORT = Number.parseInt(options.port);
  const URL = options.url;
  const output_path = options.output;
  const input_path = options.input;
  const imports_path = options.imports;
  const full_workflow = options.full;
  const override = options.override;
  const relative_import_path = import_path3.default.relative(import_path3.default.dirname(output_path), imports_path);
  console.log();
  console.log(`Server URL: ${URL}`);
  console.log(`Port: ${PORT}`);
  console.log(`Output path: ${output_path}`);
  console.log(`Relative input path: ${relative_import_path}`);
  console.log();
  const comfy = new ComfyInterface(`${URL}:${PORT}`);
  const all_nodes = await comfy.getNodeTypes();
  let workflow;
  if (input_path.endsWith(".json"))
    workflow = JSON.parse(import_fs3.default.readFileSync(input_path, { encoding: "ascii" }));
  else {
    if (![".jpg", ".jpeg", ".png", ".tiff", ".webp", ".gif", ".avif", ".heic", ".heif"].includes(import_path3.default.extname(input_path).toLowerCase())) {
      console.warn("Unsupported input file format. Treating it like an exif image.");
    }
    const tags = await import_exifreader.default.load(input_path);
    workflow = await try_all([
      () => JSON.parse(tags.prompt?.value),
      // ()=>JSON.parse(tags.description?.value),
      () => JSON.parse(tags.Make?.value?.[0].replace(/^workflow:/, "")),
      () => JSON.parse(tags.Model?.value?.[0].replace(/^prompt:/, ""))
    ]);
    if (workflow === null) {
      console.log(tags);
      console.log((0, import_console2.error)("Fatal Error: Failed to find workflow data in the image's metadata."));
      return;
    }
  }
  const IGNORE_NODES = /* @__PURE__ */ new Set(["Note"]);
  function check_if_nodes_installed(nodes) {
    const uninstalled_nodes = nodes.filter((node) => !all_nodes[node]).filter((node) => !IGNORE_NODES.has(node));
    if (uninstalled_nodes.length > 0) {
      console.log((0, import_console2.error)("Fatal Error: Some of the nodes in this workflow could not be found in your ComfyUI installation. Please make sure everything is installed and loaded correctly."));
      console.log([...new Set(uninstalled_nodes)].join(", "));
      return false;
    }
    return true;
  }
  const imports = /* @__PURE__ */ new Set();
  let node_creations = [];
  if (!("version" in workflow)) {
    let get_value = function(v) {
      if (!Array.isArray(v))
        return JSON.stringify(v);
      let target = placeholders.get(v[0]);
      let socket_name = target?.type.output_name[v[1]];
      let target_name = target?.name;
      return `${target_name}.outputs.${socket_name}`;
    };
    const sorting = sort_nodes_topologically(workflow);
    const nodes = sorting.map((id) => [id, workflow[id]]).filter(([k, v]) => !IGNORE_NODES.has(v.class_type));
    if (!check_if_nodes_installed(nodes.map(([k, v]) => v.class_type)))
      return;
    let placeholders = /* @__PURE__ */ new Map();
    node_creations = nodes.map(([k, node]) => {
      const base_name = clean_key(node.class_type);
      let var_name = `${base_name}${k}`;
      placeholders.set(k, {
        name: var_name,
        type: all_nodes[base_name]
      });
      imports.add(base_name);
      let param_str = Object.entries(node.inputs).map(([k2, v]) => `
	${k2}: ${get_value(v)}`).join(",");
      if (param_str.length > 0)
        param_str += "\n";
      return `const ${var_name} = new ${node.class_type}({${param_str}});`;
    });
  } else {
    const nodes = workflow.nodes.filter((v) => !IGNORE_NODES.has(v.type));
    nodes.sort((a, b) => a.order - b.order);
    if (!check_if_nodes_installed(nodes.map((node) => node.type)))
      return;
    ensure_directory(import_path3.default.dirname(output_path));
    const link_map = /* @__PURE__ */ new Map();
    const node_vars = /* @__PURE__ */ new Map();
    const used_names = /* @__PURE__ */ new Set();
    nodes.forEach((node) => {
      node.outputs.forEach((output) => {
        output.links?.forEach((linkId) => {
          link_map.set(linkId, { node_id: node.id, output_name: output.name });
        });
      });
      const base_name = clean_key(node.type);
      let var_name = `${base_name}${node.id}`;
      let counter = 1;
      while (used_names.has(var_name)) {
        var_name = `${base_name}${node.id}_${counter++}`;
      }
      used_names.add(var_name);
      node_vars.set(node.id, var_name);
    });
    nodes.forEach((node) => {
      const class_name = node.type;
      const var_name = node_vars.get(node.id);
      imports.add(class_name);
      const params = {};
      const nodeType = all_nodes[class_name];
      let all_inputs = [...nodeType.input_order?.required ?? {}, ...nodeType.input_order?.optional ?? []];
      const possible_inputs = new Set(all_inputs);
      node.inputs.forEach((input) => {
        if (!possible_inputs.has(input.name)) {
          console.error((0, import_console2.error)(`Failed Sanity Check! Node ${class_name} does not have an input named ${input.name}. Make sure your imports are up to date!`));
        }
        possible_inputs.delete(input.name);
        if (input.link !== void 0 && input.link !== null) {
          const source = link_map.get(input.link);
          if (!source) {
            return;
          }
          const sourceVar = node_vars.get(source.node_id);
          params[input.name] = `${sourceVar}.outputs.${source.output_name}`;
        }
      });
      const remaining_inputs = all_inputs.filter((k) => possible_inputs.has(k));
      let offset = 0;
      let skip_next = false;
      if (node.widgets_values)
        node.widgets_values.forEach((value, index) => {
          if (skip_next) {
            skip_next = false;
            return;
          }
          params[`${remaining_inputs[index - offset]}`] = JSON.stringify(value);
          if (remaining_inputs[index]?.toLowerCase().endsWith("seed")) {
            offset++;
            skip_next = true;
          }
        });
      let paramStr = Object.entries(params).map(([k, v]) => `
	${k}: ${v}`).join(",");
      if (paramStr.length > 0)
        paramStr += "\n";
      node_creations.push(`const ${var_name} = new ${class_name}({ ${paramStr} });`);
    });
  }
  const import_statements = Array.from(imports).map((cls) => `import { ${cls} } from "${get_node_path(relative_import_path, all_nodes[cls]).slice(0, -3)}";`).join("\n");
  const result = full_workflow ? `${import_statements}
import { ComfyInterface, ComfyNode } from "comfy-code";

const comfy = new ComfyInterface('${URL}:${PORT}');

const activeGroup = ComfyNode.newActiveGroup();

${node_creations.join("\n")}

comfy.executePrompt(activeGroup, "print").then(comfy.quit.bind(comfy));` : `${import_statements}

${node_creations.join("\n")}`;
  console.log("--- RESULT ---");
  console.log();
  console.log(result);
  console.log();
  if (!override) {
    write_file_with_confirmation(output_path, result, true);
  } else {
    import_fs3.default.writeFileSync(output_path, result);
    console.log(success2(`File "${output_path}" has been created.`));
  }
}

// package.json
var version = "1.0.5";

// scripts/index.ts
program.name("comfy-code").description("Comfy-Code lets you generate typescript types and scripts from ComfyUI.").version(version);
var import_command = new Command("import").description("Various importers, both from files and from an API.");
import_command.addCommand(import_nodes_command);
import_command.addCommand(import_workflow_command);
program.addCommand(import_command);
program.parse();
