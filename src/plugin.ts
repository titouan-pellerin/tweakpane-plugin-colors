import {
	BaseInputParams,
	Color,
	ColorController,
	ColorInputParams,
	colorToHexRgbaString,
	colorToHexRgbString,
	CompositeColorParser,
	InputBindingPlugin,
	ParamsParsers,
	parseParams,
	parsePickerLayout,
	RgbaColorObject,
	RgbColorObject,
} from '@tweakpane/core';

export interface PluginInputParams extends BaseInputParams {
	max?: number;
	min?: number;
	step?: number;
	view: 'color-2';
}

function colorFromObject(value: unknown): Color {
	if (Color.isColorObject(value)) {
		const tValue = {...value};
		tValue.r = value.r * 255;
		tValue.g = value.g * 255;
		tValue.b = value.b * 255;
		return Color.fromObject(tValue);
	}
	return Color.black();
}

function parseColorInputParams(
	params: Record<string, unknown>,
): ColorInputParams | undefined {
	const p = ParamsParsers;
	return parseParams<ColorInputParams>(params, {
		view: p.required.constant('color-2'),
		alpha: p.optional.boolean,
		expanded: p.optional.boolean,
		picker: p.optional.custom(parsePickerLayout),
	});
}

function shouldSupportAlpha(
	initialValue: RgbColorObject | RgbaColorObject,
): boolean {
	return Color.isRgbaColorObject(initialValue);
}

function writeRgbaColorObject(target: any, value: Color) {
	const obj = value.toRgbaObject();
	target.writeProperty('r', obj.r / 255);
	target.writeProperty('g', obj.g / 255);
	target.writeProperty('b', obj.b / 255);
	target.writeProperty('a', obj.a / 255);
}

function writeRgbColorObject(target: any, value: Color) {
	const obj = value.toRgbaObject();
	target.writeProperty('r', obj.r / 255);
	target.writeProperty('g', obj.g / 255);
	target.writeProperty('b', obj.b / 255);
}

function createColorObjectWriter(supportsAlpha: boolean): any {
	return supportsAlpha ? writeRgbaColorObject : writeRgbColorObject;
}

// NOTE: You can see JSDoc comments of `InputBindingPlugin` for details about each property
//
// `InputBindingPlugin<In, Ex, P>` means...
// - The plugin receives the bound value as `Ex`,
// - converts `Ex` into `In` and holds it
// - P is the type of the parsed parameters
//
export const CustomObjectColorInputPlugin: InputBindingPlugin<
	Color,
	RgbColorObject | RgbaColorObject,
	ColorInputParams
> = {
	id: 'input-color-object',
	type: 'input',
	accept: (value, params) => {
		if (!Color.isColorObject(value)) {
			return null;
		}
		const result = parseColorInputParams(params);

		console.log('result', result);
		console.log('value', value);

		return result
			? {
					initialValue: value,
					params: result,
			  }
			: null;
	},
	binding: {
		reader: (_args) => colorFromObject,
		equals: Color.equals,
		writer: (args) =>
			createColorObjectWriter(shouldSupportAlpha(args.initialValue)),
	},
	controller: (args) => {
		const supportsAlpha = Color.isRgbaColorObject(args.initialValue);
		const expanded =
			'expanded' in args.params ? args.params.expanded : undefined;
		const picker = 'picker' in args.params ? args.params.picker : undefined;
		const formatter = supportsAlpha
			? colorToHexRgbaString
			: colorToHexRgbString;

		return new ColorController(args.document, {
			expanded: expanded ?? false,
			formatter: formatter,
			parser: CompositeColorParser,
			pickerLayout: picker ?? 'popup',
			supportsAlpha: supportsAlpha,
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};
