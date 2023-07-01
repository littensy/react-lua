type Defaultize<P, D> = P extends any
	? string extends keyof P
		? P
		: Pick<P, Exclude<keyof P, keyof D>> &
				Partial<Pick<P, Extract<keyof P, keyof D>>> &
				Partial<Pick<D, Exclude<keyof D, keyof P>>>
	: never;

type JsxChild =
	| boolean
	| React.ReactElement
	| ReadonlyArray<React.ReactElement>
	| ReadonlyMap<string | number, React.ReactElement>
	| undefined;

type JsxNode = JsxChild | JsxChild[];

type AllowRefs<T> = T extends Instance ? React.Ref<T> : never;

type InferEnumNames<T> = T extends EnumItem ? T["Name"] : never;

export type JsxInstanceProperties<T extends Instance> = {
	[P in Exclude<WritablePropertyNames<T>, "Parent" | "Name">]?:
		| T[P]
		| AllowRefs<T[P]>
		| InferEnumNames<T[P]>
		| React.Binding<T[P]>;
};

export type JsxInstanceEvents<T extends Instance> = {
	[K in ExtractKeys<T, RBXScriptSignal>]?: T[K] extends RBXScriptSignal<infer F>
		? (rbx: T, ...args: Parameters<F>) => void
		: never;
};

export type JsxInstanceChangeEvents<T extends Instance> = { [key in InstancePropertyNames<T>]?: (rbx: T) => void };

export type JsxInstance<T extends Instance> = React.PropsWithChildren<any> &
	JsxInstanceProperties<T> & {
		Event?: JsxInstanceEvents<T>;
		Change?: JsxInstanceChangeEvents<T>;
		Ref?: React.Ref<T> | React.RefCallback<T>;
	};

declare global {
	namespace JSX {
		type Element = React.ReactElement<any, any>;

		interface ElementClass extends React.Component<any> {
			render(): React.ReactNode | undefined;
		}

		interface ElementChildrenAttribute {
			children: {};
		}

		interface IntrinsicAttributes extends React.Attributes {
			Key?: string | number;
			children?: JsxNode;
		}

		interface IntrinsicClassAttributes<T extends Instance> extends React.ClassAttributes<T> {}

		type LibraryManagedAttributes<C, P> = C extends { defaultProps: infer D } ? Defaultize<P, D> : P;

		type IntrinsicElement<T extends Instance> = JsxInstance<T> & IntrinsicAttributes;

		interface IntrinsicElements {
			billboardgui: IntrinsicElement<BillboardGui>;
			camera: IntrinsicElement<Camera>;
			canvasgroup: IntrinsicElement<CanvasGroup>;
			frame: IntrinsicElement<Frame>;
			imagebutton: IntrinsicElement<ImageButton>;
			imagelabel: IntrinsicElement<ImageLabel>;
			screengui: IntrinsicElement<ScreenGui>;
			scrollingframe: IntrinsicElement<ScrollingFrame>;
			surfacegui: IntrinsicElement<SurfaceGui>;
			textbox: IntrinsicElement<TextBox>;
			textbutton: IntrinsicElement<TextButton>;
			textlabel: IntrinsicElement<TextLabel>;
			uiaspectratioconstraint: IntrinsicElement<UIAspectRatioConstraint>;
			uicorner: IntrinsicElement<UICorner>;
			uigradient: IntrinsicElement<UIGradient>;
			uigridlayout: IntrinsicElement<UIGridLayout>;
			uilistlayout: IntrinsicElement<UIListLayout>;
			uipadding: IntrinsicElement<UIPadding>;
			uipagelayout: IntrinsicElement<UIPageLayout>;
			uiscale: IntrinsicElement<UIScale>;
			uisizeconstraint: IntrinsicElement<UISizeConstraint>;
			uistroke: IntrinsicElement<UIStroke>;
			uitablelayout: IntrinsicElement<UITableLayout>;
			uitextsizeconstraint: IntrinsicElement<UITextSizeConstraint>;
			viewportframe: IntrinsicElement<ViewportFrame>;
		}
	}
}
