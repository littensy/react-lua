// Type definitions for React 17.0
// Project: https://react.dev/
// Definitions by: Asana <https://asana.com>
//                 AssureSign <http://www.assuresign.com>
//                 Microsoft <https://microsoft.com>
//                 John Reilly <https://github.com/johnnyreilly>
//                 Benoit Benezech <https://github.com/bbenezech>
//                 Patricio Zavolinsky <https://github.com/pzavolinsky>
//                 Eric Anderson <https://github.com/ericanderson>
//                 Dovydas Navickas <https://github.com/DovydasNavickas>
//                 Josh Rutherford <https://github.com/theruther4d>
//                 Guilherme Hübner <https://github.com/guilhermehubner>
//                 Ferdy Budhidharma <https://github.com/ferdaber>
//                 Johann Rakotoharisoa <https://github.com/jrakotoharisoa>
//                 Olivier Pascal <https://github.com/pascaloliv>
//                 Martin Hochel <https://github.com/hotell>
//                 Frank Li <https://github.com/franklixuefei>
//                 Jessica Franco <https://github.com/Jessidhia>
//                 Saransh Kataria <https://github.com/saranshkataria>
//                 Kanitkorn Sujautra <https://github.com/lukyth>
//                 Sebastian Silbermann <https://github.com/eps1lon>
//                 Kyle Scully <https://github.com/zieka>
//                 Cong Zhang <https://github.com/dancerphil>
//                 Dimitri Mitropoulos <https://github.com/dimitropoulos>
//                 JongChan Choi <https://github.com/disjukr>
//                 Victor Magalhães <https://github.com/vhfmag>
//                 Dale Tan <https://github.com/hellatan>
//                 Priyanshu Rav <https://github.com/priyanshurav>
//                 Costa Alexoglou <https://github.com/konsalex>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference path="global.d.ts" />
/// <reference path="jsx.d.ts" />

import { Interaction as SchedulerInteraction } from "./scheduler";

type Booleanish = boolean | "true" | "false";

declare const UNDEFINED_VOID_ONLY: unique symbol;
// Destructors are only allowed to return void.
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };

export = React;
export as namespace React;

// Roblox API
declare namespace React {
	export interface Binding<T> {
		/**
		 * Returns the internal value of the binding. This is helpful when updating a binding relative to its current value.
		 */
		getValue(): T;

		/**
		 * Returns a new binding that maps the existing binding's value to something else. For example, `map` can be used to
		 * transform an animation progress value like `0.4` into a property that can be consumed by a Roblox Instance like
		 * `UDim2.new(0.4, 0, 1, 0)`.
		 */
		map<U>(predicate: (value: T) => U): React.Binding<U>;
	}

	/**
	 * The first value returned is a `Binding` object, which will typically be passed as a prop to a Roact host
	 * component. The second is a function that can be called with a new value to update the binding.
	 */
	export function createBinding<T>(initialValue: T): LuaTuple<[React.Binding<T>, (newValue: T) => void]>;

	/**
	 * Combines multiple bindings into a single binding. The new binding's value will have the same keys as the input
	 * table of bindings.
	 */
	export function joinBindings<T extends { [index: string]: React.Binding<U> }, U>(
		bindings: T,
	): React.Binding<{ [K in keyof T]: T[K] extends React.Binding<infer V> ? V : never }>;
	export function joinBindings<T>(bindings: ReadonlyArray<React.Binding<T>>): React.Binding<Array<T>>;
	export function joinBindings<T>(
		bindings: ReadonlyMap<string | number, React.Binding<T>>,
	): React.Binding<Map<string | number, React.Binding<T>>>;
}

declare namespace React {
	//
	// React Elements
	// ----------------------------------------------------------------------

	type ElementType<P = any> =
		| {
				[K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never;
		  }[keyof JSX.IntrinsicElements]
		| ComponentType<P>;
	/**
	 * @deprecated Please use `ElementType`
	 */
	type ReactType<P = any> = ElementType<P>;
	type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

	type JSXElementConstructor<P> =
		| ((props: P) => ReactElement<any, any> | undefined)
		| (new (props: P) => Component<any, any>);

	interface RefObject<T> {
		readonly current: T | undefined;
	}
	// Bivariance hack for consistent unsoundness with RefObject
	type RefCallback<T> = { bivarianceHack(instance: T | undefined): void }["bivarianceHack"];
	type Ref<T> = RefCallback<T> | RefObject<T> | undefined;
	type LegacyRef<T> = string | Ref<T>;
	/**
	 * Gets the instance type for a React element. The instance will be different for various component types:
	 *
	 * - React class components will be the class instance. So if you had `class Foo extends React.Component<{}> {}`
	 *   and used `React.ElementRef<typeof Foo>` then the type would be the instance of `Foo`.
	 * - React stateless functional components do not have a backing instance and so `React.ElementRef<typeof Bar>`
	 *   (when `Bar` is `function Bar() {}`) will give you the `undefined` type.
	 * - JSX intrinsics like `div` will give you their DOM instance. For `React.ElementRef<'div'>` that would be
	 *   `HTMLDivElement`. For `React.ElementRef<'input'>` that would be `HTMLInputElement`.
	 * - React stateless functional components that forward a `ref` will give you the `ElementRef` of the forwarded
	 *   to component.
	 *
	 * `C` must be the type _of_ a React component so you need to use typeof as in `React.ElementRef<typeof MyComponent>`.
	 *
	 * @todo In Flow, this works a little different with forwarded refs and the `AbstractComponent` that
	 *       `React.forwardRef()` returns.
	 */
	type ElementRef<
		C extends
			| ForwardRefExoticComponent<any>
			| { new (props: any): Component<any> }
			| ((props: any, context?: any) => ReactElement | undefined)
			| keyof JSX.IntrinsicElements,
	> =
		// need to check first if `ref` is a valid prop for ts@3.0
		// otherwise it will infer `{}` instead of `never`
		"ref" extends keyof ComponentPropsWithRef<C>
			? NonNullable<ComponentPropsWithRef<C>["ref"]> extends Ref<infer Instance>
				? Instance
				: never
			: never;

	type ComponentState = any;

	type Key = string | number;

	/**
	 * @internal You shouldn't need to use this type since you never see these attributes
	 * inside your component or have to validate them.
	 */
	interface Attributes {
		key?: Key | undefined | undefined;
	}
	interface RefAttributes<T> extends Attributes {
		ref?: Ref<T> | undefined;
	}
	interface ClassAttributes<T> extends Attributes {
		ref?: LegacyRef<T> | undefined;
	}

	interface ReactElement<
		P = any,
		T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>,
	> {
		type: T;
		props: P;
		key: Key | undefined;
	}

	interface ReactComponentElement<
		T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
		P = Pick<ComponentProps<T>, Exclude<keyof ComponentProps<T>, "key" | "ref">>,
	> extends ReactElement<P, Exclude<T, number>> {}

	/**
	 * @deprecated Please use `FunctionComponentElement`
	 */
	type SFCElement<P> = FunctionComponentElement<P>;

	interface FunctionComponentElement<P> extends ReactElement<P, FunctionComponent<P>> {
		ref?: ("ref" extends keyof P ? (P extends { ref?: infer R | undefined } ? R : never) : never) | undefined;
	}

	type CElement<P, T extends Component<P, ComponentState>> = ComponentElement<P, T>;
	interface ComponentElement<P, T extends Component<P, ComponentState>> extends ReactElement<P, ComponentClass<P>> {
		ref?: LegacyRef<T> | undefined;
	}

	type ClassicElement<P> = CElement<P, ClassicComponent<P, ComponentState>>;

	// string fallback for custom web-components
	interface DOMElement<P extends HTMLAttributes<T> | SVGAttributes<T>, T extends Element>
		extends ReactElement<P, string> {
		ref: LegacyRef<T>;
	}

	// ReactHTML for ReactHTMLElement
	interface ReactHTMLElement<T extends HTMLElement> extends DetailedReactHTMLElement<AllHTMLAttributes<T>, T> {}

	interface DetailedReactHTMLElement<P extends HTMLAttributes<T>, T extends HTMLElement> extends DOMElement<P, T> {
		type: keyof ReactHTML;
	}

	// ReactSVG for ReactSVGElement
	interface ReactSVGElement extends DOMElement<SVGAttributes<SVGElement>, SVGElement> {
		type: keyof ReactSVG;
	}

	interface ReactPortal extends ReactElement {
		key: Key | undefined;
		children: ReactNode;
	}

	//
	// Factories
	// ----------------------------------------------------------------------

	type Factory<P> = (props?: Attributes & P, ...children: ReactNode[]) => ReactElement<P>;

	/**
	 * @deprecated Please use `FunctionComponentFactory`
	 */
	type SFCFactory<P> = FunctionComponentFactory<P>;

	type FunctionComponentFactory<P> = (
		props?: Attributes & P,
		...children: ReactNode[]
	) => FunctionComponentElement<P>;

	type ComponentFactory<P, T extends Component<P, ComponentState>> = (
		props?: ClassAttributes<T> & P,
		...children: ReactNode[]
	) => CElement<P, T>;

	type CFactory<P, T extends Component<P, ComponentState>> = ComponentFactory<P, T>;
	type ClassicFactory<P> = CFactory<P, ClassicComponent<P, ComponentState>>;

	type DOMFactory<P extends DOMAttributes<T>, T extends Element> = (
		props?: (ClassAttributes<T> & P) | undefined,
		...children: ReactNode[]
	) => DOMElement<P, T>;

	interface HTMLFactory<T extends HTMLElement> extends DetailedHTMLFactory<AllHTMLAttributes<T>, T> {}

	interface DetailedHTMLFactory<P extends HTMLAttributes<T>, T extends HTMLElement> extends DOMFactory<P, T> {
		(props?: (ClassAttributes<T> & P) | undefined, ...children: ReactNode[]): DetailedReactHTMLElement<P, T>;
	}

	interface SVGFactory extends DOMFactory<SVGAttributes<SVGElement>, SVGElement> {
		(
			props?: (ClassAttributes<SVGElement> & SVGAttributes<SVGElement>) | undefined,
			...children: ReactNode[]
		): ReactSVGElement;
	}

	//
	// React Nodes
	// ----------------------------------------------------------------------

	type ReactText = string | number;
	type ReactChild = ReactElement | ReactText;

	/**
	 * @deprecated Use either `ReactNode[]` if you need an array or `Iterable<ReactNode>` if its passed to a host component.
	 */
	interface ReactNodeArray extends ReadonlyArray<ReactNode> {}
	type ReactFragment = {} | Iterable<ReactNode>;
	type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | undefined | undefined;

	//
	// Top Level API
	// ----------------------------------------------------------------------

	// DOM Elements
	function createFactory<T extends HTMLElement>(type: keyof ReactHTML): HTMLFactory<T>;
	function createFactory(type: keyof ReactSVG): SVGFactory;
	function createFactory<P extends DOMAttributes<T>, T extends Element>(type: string): DOMFactory<P, T>;

	// Custom components
	function createFactory<P>(type: FunctionComponent<P>): FunctionComponentFactory<P>;
	function createFactory<P>(
		type: ClassType<P, ClassicComponent<P, ComponentState>, ClassicComponentClass<P>>,
	): CFactory<P, ClassicComponent<P, ComponentState>>;
	function createFactory<P, T extends Component<P, ComponentState>, C extends ComponentClass<P>>(
		type: ClassType<P, T, C>,
	): CFactory<P, T>;
	function createFactory<P>(type: ComponentClass<P>): Factory<P>;

	// DOM Elements
	// TODO: generalize this to everything in `keyof ReactHTML`, not just "input"
	function createElement(
		type: "input",
		props?: (InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement>) | undefined,
		...children: ReactNode[]
	): DetailedReactHTMLElement<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
	function createElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
		type: keyof ReactHTML,
		props?: (ClassAttributes<T> & P) | undefined,
		...children: ReactNode[]
	): DetailedReactHTMLElement<P, T>;
	function createElement<P extends SVGAttributes<T>, T extends SVGElement>(
		type: keyof ReactSVG,
		props?: (ClassAttributes<T> & P) | undefined,
		...children: ReactNode[]
	): ReactSVGElement;
	function createElement<P extends DOMAttributes<T>, T extends Element>(
		type: string,
		props?: (ClassAttributes<T> & P) | undefined,
		...children: ReactNode[]
	): DOMElement<P, T>;

	// Custom components

	function createElement<P extends {}>(
		type: FunctionComponent<P>,
		props?: (Attributes & P) | undefined,
		...children: ReactNode[]
	): FunctionComponentElement<P>;
	function createElement<P extends {}>(
		type: ClassType<P, ClassicComponent<P, ComponentState>, ClassicComponentClass<P>>,
		props?: (ClassAttributes<ClassicComponent<P, ComponentState>> & P) | undefined,
		...children: ReactNode[]
	): CElement<P, ClassicComponent<P, ComponentState>>;
	function createElement<P extends {}, T extends Component<P, ComponentState>, C extends ComponentClass<P>>(
		type: ClassType<P, T, C>,
		props?: (ClassAttributes<T> & P) | undefined,
		...children: ReactNode[]
	): CElement<P, T>;
	function createElement<P extends {}>(
		type: FunctionComponent<P> | ComponentClass<P> | string,
		props?: (Attributes & P) | undefined,
		...children: ReactNode[]
	): ReactElement<P>;

	// DOM Elements
	// ReactHTMLElement
	function cloneElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
		element: DetailedReactHTMLElement<P, T>,
		props?: P,
		...children: ReactNode[]
	): DetailedReactHTMLElement<P, T>;
	// ReactHTMLElement, less specific
	function cloneElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
		element: ReactHTMLElement<T>,
		props?: P,
		...children: ReactNode[]
	): ReactHTMLElement<T>;
	// SVGElement
	function cloneElement<P extends SVGAttributes<T>, T extends SVGElement>(
		element: ReactSVGElement,
		props?: P,
		...children: ReactNode[]
	): ReactSVGElement;
	// DOM Element (has to be the last, because type checking stops at first overload that fits)
	function cloneElement<P extends DOMAttributes<T>, T extends Element>(
		element: DOMElement<P, T>,
		props?: DOMAttributes<T> & P,
		...children: ReactNode[]
	): DOMElement<P, T>;

	// Custom components
	function cloneElement<P>(
		element: FunctionComponentElement<P>,
		props?: Partial<P> & Attributes,
		...children: ReactNode[]
	): FunctionComponentElement<P>;
	function cloneElement<P, T extends Component<P, ComponentState>>(
		element: CElement<P, T>,
		props?: Partial<P> & ClassAttributes<T>,
		...children: ReactNode[]
	): CElement<P, T>;
	function cloneElement<P>(
		element: ReactElement<P>,
		props?: Partial<P> & Attributes,
		...children: ReactNode[]
	): ReactElement<P>;

	// Context via RenderProps
	interface ProviderProps<T> {
		value: T;
		children?: ReactNode | undefined;
	}

	interface ConsumerProps<T> {
		children: (value: T) => ReactNode;
	}

	// TODO: similar to how Fragment is actually a symbol, the values returned from createContext,
	// forwardRef and memo are actually objects that are treated specially by the renderer; see:
	// https://github.com/facebook/react/blob/v16.6.0/packages/react/src/ReactContext.js#L35-L48
	// https://github.com/facebook/react/blob/v16.6.0/packages/react/src/forwardRef.js#L42-L45
	// https://github.com/facebook/react/blob/v16.6.0/packages/react/src/memo.js#L27-L31
	// However, we have no way of telling the JSX parser that it's a JSX element type or its props other than
	// by pretending to be a normal component.
	//
	// We don't just use ComponentType or FunctionComponent types because you are not supposed to attach statics to this
	// object, but rather to the original function.
	interface ExoticComponent<P = {}> {
		/**
		 * **NOTE**: Exotic components are not callable.
		 */
		(props: P): ReactElement | undefined;
		readonly $$typeof: symbol;
	}

	interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
		displayName?: string | undefined;
	}

	interface ProviderExoticComponent<P> extends ExoticComponent<P> {}

	type ContextType<C extends Context<any>> = C extends Context<infer T> ? T : never;

	// NOTE: only the Context object itself can get a displayName
	// https://github.com/facebook/react-devtools/blob/e0b854e4c/backend/attachRendererFiber.js#L310-L325
	type Provider<T> = ProviderExoticComponent<ProviderProps<T>>;
	type Consumer<T> = ExoticComponent<ConsumerProps<T>>;
	interface Context<T> {
		Provider: Provider<T>;
		Consumer: Consumer<T>;
		displayName?: string | undefined;
	}
	function createContext<T>(
		// If you thought this should be optional, see
		// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24509#issuecomment-382213106
		defaultValue: T,
	): Context<T>;

	function isValidElement<P>(object: {} | undefined | undefined): object is ReactElement<P>;

	const Children: ReactChildren;
	const Fragment: ExoticComponent<{ children?: ReactNode | undefined }>;
	const StrictMode: ExoticComponent<{ children?: ReactNode | undefined }>;

	interface SuspenseProps {
		children?: ReactNode | undefined;

		// TODO(react18): `fallback?: ReactNode;`
		/** A fallback react tree to show when a Suspense child (like React.lazy) suspends */
		fallback: NonNullable<ReactNode> | undefined;
	}

	// TODO(react18): Updated JSDoc to reflect that Suspense works on the server.
	/**
	 * This feature is not yet available for server-side rendering.
	 * Suspense support will be added in a later release.
	 */
	const Suspense: ExoticComponent<SuspenseProps>;
	const version: string;

	/**
	 * {@link https://react.dev/reference/react/Profiler#onrender-callback Profiler API}}
	 */
	type ProfilerOnRenderCallback = (
		id: string,
		phase: "mount" | "update",
		actualDuration: number,
		baseDuration: number,
		startTime: number,
		commitTime: number,
		interactions: Set<SchedulerInteraction>,
	) => void;
	interface ProfilerProps {
		children?: ReactNode | undefined;
		id: string;
		onRender: ProfilerOnRenderCallback;
	}

	const Profiler: ExoticComponent<ProfilerProps>;

	//
	// Component API
	// ----------------------------------------------------------------------

	type ReactInstance = Component<any> | Element;

	// Base component for plain JS classes
	interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {}
	class Component<P, S> {
		// tslint won't let me format the sample code in a way that vscode likes it :(
		/**
		 * If set, `this.context` will be set at runtime to the current value of the given Context.
		 *
		 * Usage:
		 *
		 * ```ts
		 * type MyContext = number
		 * const Ctx = React.createContext<MyContext>(0)
		 *
		 * class Foo extends React.Component {
		 *   static contextType = Ctx
		 *   context!: React.ContextType<typeof Ctx>
		 *   render () {
		 *     return <>My context's value: {this.context}</>;
		 *   }
		 * }
		 * ```
		 *
		 * @see https://react.dev/reference/react/Component#static-contexttype
		 */
		static contextType?: Context<any> | undefined;

		/**
		 * If using the new style context, re-declare this in your class to be the
		 * `React.ContextType` of your `static contextType`.
		 * Should be used with type annotation or static contextType.
		 *
		 * ```ts
		 * static contextType = MyContext
		 * // For TS pre-3.7:
		 * context!: React.ContextType<typeof MyContext>
		 * // For TS 3.7 and above:
		 * declare context: React.ContextType<typeof MyContext>
		 * ```
		 *
		 * @see https://react.dev/reference/react/Component#context
		 */
		// TODO (TypeScript 3.0): unknown
		context: any;

		constructor(props: Readonly<P> | P);
		/**
		 * @deprecated
		 * @see https://legacy.reactjs.org/docs/legacy-context.html
		 */
		constructor(props: P, context: any);

		// We MUST keep setState() as a unified signature because it allows proper checking of the method return type.
		// See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18365#issuecomment-351013257
		// Also, the ` | S` allows intellisense to not be dumbisense
		setState<K extends keyof S>(
			state:
				| ((prevState: Readonly<S>, props: Readonly<P>) => Pick<S, K> | S | undefined)
				| (Pick<S, K> | S | undefined),
			callback?: () => void,
		): void;

		forceUpdate(callback?: () => void): void;
		render(): ReactNode;

		// React.Props<T> is now deprecated, which means that the `children`
		// property is not available on `P` by default, even though you can
		// always pass children as variadic arguments to `createElement`.
		// In the future, if we can define its call signature conditionally
		// on the existence of `children` in `P`, then we should remove this.
		readonly props: Readonly<P> & Readonly<{ children?: ReactNode | undefined }>;
		state: Readonly<S>;
		/**
		 * @deprecated
		 * https://legacy.reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs
		 */
		refs: {
			[key: string]: ReactInstance;
		};
	}

	class PureComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> {}

	interface ClassicComponent<P = {}, S = {}> extends Component<P, S> {
		replaceState(nextState: S, callback?: () => void): void;
		isMounted(): boolean;
		getInitialState?(): S;
	}

	interface ChildContextProvider<CC> {
		getChildContext(): CC;
	}

	//
	// Class Interfaces
	// ----------------------------------------------------------------------

	/**
	 * @deprecated as of recent React versions, function components can no
	 * longer be considered 'stateless'. Please use `FunctionComponent` instead.
	 *
	 * @see [React Hooks](https://reactjs.org/docs/hooks-intro.html)
	 */
	type SFC<P = {}> = FunctionComponent<P>;

	/**
	 * @deprecated as of recent React versions, function components can no
	 * longer be considered 'stateless'. Please use `FunctionComponent` instead.
	 *
	 * @see [React Hooks](https://reactjs.org/docs/hooks-intro.html)
	 */
	type StatelessComponent<P = {}> = FunctionComponent<P>;

	type FC<P = {}> = FunctionComponent<P>;

	interface FunctionComponent<P = {}> {
		(props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | undefined;
		defaultProps?: Partial<P> | undefined;
		displayName?: string | undefined;
	}

	type VFC<P = {}> = VoidFunctionComponent<P>;

	interface VoidFunctionComponent<P = {}> {
		(props: P, context?: any): ReactElement<any, any> | undefined;
		defaultProps?: Partial<P> | undefined;
		displayName?: string | undefined;
	}

	type ForwardedRef<T> = ((instance: T | undefined) => void) | MutableRefObject<T | undefined> | undefined;

	interface ForwardRefRenderFunction<T, P = {}> {
		(props: PropsWithChildren<P>, ref: ForwardedRef<T>): ReactElement | undefined;
		displayName?: string | undefined;
		// explicit rejected with `never` required due to
		// https://github.com/microsoft/TypeScript/issues/36826
		/**
		 * defaultProps are not supported on render functions
		 */
		defaultProps?: never | undefined;
		/**
		 * propTypes are not supported on render functions
		 */
		propTypes?: never | undefined;
	}

	/**
	 * @deprecated Use ForwardRefRenderFunction. forwardRef doesn't accept a
	 *             "real" component.
	 */
	interface RefForwardingComponent<T, P = {}> extends ForwardRefRenderFunction<T, P> {}

	interface ComponentClass<P = {}, S = ComponentState> extends StaticLifecycle<P, S> {
		new (props: P, context?: any): Component<P, S>;
		contextType?: Context<any> | undefined;
		defaultProps?: Partial<P> | undefined;
		displayName?: string | undefined;
	}

	interface ClassicComponentClass<P = {}> extends ComponentClass<P> {
		new (props: P, context?: any): ClassicComponent<P, ComponentState>;
		getDefaultProps?(): P;
	}

	/**
	 * We use an intersection type to infer multiple type parameters from
	 * a single argument, which is useful for many top-level API defs.
	 * See https://github.com/Microsoft/TypeScript/issues/7234 for more info.
	 */
	type ClassType<P, T extends Component<P, ComponentState>, C extends ComponentClass<P>> = C &
		(new (props: P, context?: any) => T);

	//
	// Component Specs and Lifecycle
	// ----------------------------------------------------------------------

	// This should actually be something like `Lifecycle<P, S> | DeprecatedLifecycle<P, S>`,
	// as React will _not_ call the deprecated lifecycle methods if any of the new lifecycle
	// methods are present.
	interface ComponentLifecycle<P, S, SS = any> extends NewLifecycle<P, S, SS>, DeprecatedLifecycle<P, S> {
		/**
		 * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
		 */
		componentDidMount?(): void;
		/**
		 * Called to determine whether the change in props and state should trigger a re-render.
		 *
		 * `Component` always returns true.
		 * `PureComponent` implements a shallow comparison on props and state and returns true if any
		 * props or states have changed.
		 *
		 * If false is returned, `Component#render`, `componentWillUpdate`
		 * and `componentDidUpdate` will not be called.
		 */
		shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean;
		/**
		 * Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as
		 * cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.
		 */
		componentWillUnmount?(): void;
		/**
		 * Catches exceptions generated in descendant components. Unhandled exceptions will cause
		 * the entire component tree to unmount.
		 */
		componentDidCatch?(error: unknown, errorInfo: ErrorInfo): void;
	}

	// Unfortunately, we have no way of declaring that the component constructor must implement this
	interface StaticLifecycle<P, S> {
		getDerivedStateFromProps?: GetDerivedStateFromProps<P, S> | undefined;
		getDerivedStateFromError?: GetDerivedStateFromError<P, S> | undefined;
	}

	type GetDerivedStateFromProps<P, S> =
		/**
		 * Returns an update to a component's state based on its new props and old state.
		 *
		 * Note: its presence prevents any of the deprecated lifecycle methods from being invoked
		 */
		(nextProps: Readonly<P>, prevState: S) => Partial<S> | undefined;

	type GetDerivedStateFromError<P, S> =
		/**
		 * This lifecycle is invoked after an error has been thrown by a descendant component.
		 * It receives the error that was thrown as a parameter and should return a value to update state.
		 *
		 * Note: its presence prevents any of the deprecated lifecycle methods from being invoked
		 */
		(error: any) => Partial<S> | undefined;

	// This should be "infer SS" but can't use it yet
	interface NewLifecycle<P, S, SS> {
		/**
		 * Runs before React applies the result of `render` to the document, and
		 * returns an object to be given to componentDidUpdate. Useful for saving
		 * things such as scroll position before `render` causes changes to it.
		 *
		 * Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
		 * lifecycle events from running.
		 */
		getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>): SS | undefined;
		/**
		 * Called immediately after updating occurs. Not called for the initial render.
		 *
		 * The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.
		 */
		componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void;
	}

	interface DeprecatedLifecycle<P, S> {
		/**
		 * Called immediately before mounting occurs, and before `Component#render`.
		 * Avoid introducing any side-effects or subscriptions in this method.
		 *
		 * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
		 * prevents this from being invoked.
		 *
		 * @deprecated 16.3, use componentDidMount or the constructor instead; will stop working in React 17
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
		 */
		componentWillMount?(): void;
		/**
		 * Called immediately before mounting occurs, and before `Component#render`.
		 * Avoid introducing any side-effects or subscriptions in this method.
		 *
		 * This method will not stop working in React 17.
		 *
		 * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
		 * prevents this from being invoked.
		 *
		 * @deprecated 16.3, use componentDidMount or the constructor instead
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
		 */
		UNSAFE_componentWillMount?(): void;
		/**
		 * Called when the component may be receiving new props.
		 * React may call this even if props have not changed, so be sure to compare new and existing
		 * props if you only want to handle changes.
		 *
		 * Calling `Component#setState` generally does not trigger this method.
		 *
		 * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
		 * prevents this from being invoked.
		 *
		 * @deprecated 16.3, use static getDerivedStateFromProps instead; will stop working in React 17
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
		 */
		componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
		/**
		 * Called when the component may be receiving new props.
		 * React may call this even if props have not changed, so be sure to compare new and existing
		 * props if you only want to handle changes.
		 *
		 * Calling `Component#setState` generally does not trigger this method.
		 *
		 * This method will not stop working in React 17.
		 *
		 * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
		 * prevents this from being invoked.
		 *
		 * @deprecated 16.3, use static getDerivedStateFromProps instead
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
		 */
		UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
		/**
		 * Called immediately before rendering when new props or state is received. Not called for the initial render.
		 *
		 * Note: You cannot call `Component#setState` here.
		 *
		 * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
		 * prevents this from being invoked.
		 *
		 * @deprecated 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
		 */
		componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
		/**
		 * Called immediately before rendering when new props or state is received. Not called for the initial render.
		 *
		 * Note: You cannot call `Component#setState` here.
		 *
		 * This method will not stop working in React 17.
		 *
		 * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
		 * prevents this from being invoked.
		 *
		 * @deprecated 16.3, use getSnapshotBeforeUpdate instead
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update
		 * @see https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
		 */
		UNSAFE_componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
	}

	interface Mixin<P, S> extends ComponentLifecycle<P, S> {
		mixins?: Array<Mixin<P, S>> | undefined;
		statics?:
			| {
					[key: string]: any;
			  }
			| undefined;

		displayName?: string | undefined;

		getDefaultProps?(): P;
		getInitialState?(): S;
	}

	interface ComponentSpec<P, S> extends Mixin<P, S> {
		render(): ReactNode;

		[propertyName: string]: any;
	}

	function createRef<T>(): RefObject<T>;

	// will show `ForwardRef(${Component.displayName || Component.name})` in devtools by default,
	// but can be given its own specific name
	interface ForwardRefExoticComponent<P> extends NamedExoticComponent<P> {
		defaultProps?: Partial<P> | undefined;
	}

	function forwardRef<T, P = {}>(
		render: ForwardRefRenderFunction<T, P>,
	): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;

	/** Ensures that the props do not include ref at all */
	type PropsWithoutRef<P> =
		// Omit would not be sufficient for this. We'd like to avoid unnecessary mapping and need a distributive conditional to support unions.
		// see: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
		// https://github.com/Microsoft/TypeScript/issues/28339
		P extends any ? ("ref" extends keyof P ? Omit<P, "ref"> : P) : P;
	/** Ensures that the props do not include string ref, which cannot be forwarded */
	type PropsWithRef<P> =
		// Just "P extends { ref?: infer R }" looks sufficient, but R will infer as {} if P is {}.
		"ref" extends keyof P
			? P extends { ref?: infer R | undefined }
				? string extends R
					? PropsWithoutRef<P> & { ref?: Exclude<R, string> | undefined }
					: P
				: P
			: P;

	type PropsWithChildren<P> = P & { children?: ReactNode | undefined };

	/**
	 * NOTE: prefer ComponentPropsWithRef, if the ref is forwarded,
	 * or ComponentPropsWithoutRef when refs are not supported.
	 */
	type ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
		T extends JSXElementConstructor<infer P>
			? P
			: T extends keyof JSX.IntrinsicElements
			? JSX.IntrinsicElements[T]
			: {};
	type ComponentPropsWithRef<T extends ElementType> = T extends new (props: infer P) => Component<any, any>
		? PropsWithoutRef<P> & RefAttributes<InstanceType<T>>
		: PropsWithRef<ComponentProps<T>>;
	type ComponentPropsWithoutRef<T extends ElementType> = PropsWithoutRef<ComponentProps<T>>;

	type ComponentRef<T extends ElementType> = T extends NamedExoticComponent<
		ComponentPropsWithoutRef<T> & RefAttributes<infer Method>
	>
		? Method
		: ComponentPropsWithRef<T> extends RefAttributes<infer Method>
		? Method
		: never;

	// will show `Memo(${Component.displayName || Component.name})` in devtools by default,
	// but can be given its own specific name
	type MemoExoticComponent<T extends ComponentType<any>> = NamedExoticComponent<ComponentPropsWithRef<T>> & {
		readonly type: T;
	};

	function memo<P extends object>(
		Component: FunctionComponent<P>,
		propsAreEqual?: (
			prevProps: Readonly<PropsWithChildren<P>>,
			nextProps: Readonly<PropsWithChildren<P>>,
		) => boolean,
	): NamedExoticComponent<P>;
	function memo<T extends ComponentType<any>>(
		Component: T,
		propsAreEqual?: (prevProps: Readonly<ComponentProps<T>>, nextProps: Readonly<ComponentProps<T>>) => boolean,
	): MemoExoticComponent<T>;

	type LazyExoticComponent<T extends ComponentType<any>> = ExoticComponent<ComponentPropsWithRef<T>> & {
		readonly _result: T;
	};

	function lazy<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>): LazyExoticComponent<T>;

	//
	// React Hooks
	// ----------------------------------------------------------------------

	// based on the code in https://github.com/facebook/react/pull/13968

	// Unlike the class component setState, the updates are not allowed to be partial
	type SetStateAction<S> = S | ((prevState: S) => S);
	// this technically does accept a second argument, but it's already under a deprecation warning
	// and it's not even released so probably better to not define it.
	type Dispatch<A> = (value: A) => void;
	// Since action _can_ be undefined, dispatch may be called without any parameters.
	type DispatchWithoutAction = () => void;
	// Unlike redux, the actions _can_ be anything
	type Reducer<S, A> = (prevState: S, action: A) => S;
	// If useReducer accepts a reducer without action, dispatch may be called without any parameters.
	type ReducerWithoutAction<S> = (prevState: S) => S;
	// types used to try and prevent the compiler from reducing S
	// to a supertype common with the second argument to useReducer()
	type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
	type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
	// The identity check is done with the SameValue algorithm (Object.is), which is stricter than ===
	type ReducerStateWithoutAction<R extends ReducerWithoutAction<any>> = R extends ReducerWithoutAction<infer S>
		? S
		: never;
	// TODO (TypeScript 3.0): ReadonlyArray<unknown>
	type DependencyList = ReadonlyArray<any>;

	// NOTE: callbacks are _only_ allowed to return either void, or a destructor.
	type EffectCallback = () => void | Destructor;

	interface MutableRefObject<T> {
		current: T;
	}

	// This will technically work if you give a Consumer<T> or Provider<T> but it's deprecated and warns
	/**
	 * Accepts a context object (the value returned from `React.createContext`) and returns the current
	 * context value, as given by the nearest context provider for the given context.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useContext
	 */
	function useContext<T>(context: Context<T> /*, (not public API) observedBits?: number|boolean */): T;
	/**
	 * Returns a stateful value, and a function to update it.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useState
	 */
	function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
	// convenience overload when first argument is omitted
	/**
	 * Returns a stateful value, and a function to update it.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useState
	 */
	function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
	/**
	 * An alternative to `useState`.
	 *
	 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
	 * multiple sub-values. It also lets you optimize performance for components that trigger deep
	 * updates because you can pass `dispatch` down instead of callbacks.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useReducer
	 */
	// overload where dispatch could accept 0 arguments.
	function useReducer<R extends ReducerWithoutAction<any>, I>(
		reducer: R,
		initializerArg: I,
		initializer: (arg: I) => ReducerStateWithoutAction<R>,
	): [ReducerStateWithoutAction<R>, DispatchWithoutAction];
	/**
	 * An alternative to `useState`.
	 *
	 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
	 * multiple sub-values. It also lets you optimize performance for components that trigger deep
	 * updates because you can pass `dispatch` down instead of callbacks.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useReducer
	 */
	// overload where dispatch could accept 0 arguments.
	function useReducer<R extends ReducerWithoutAction<any>>(
		reducer: R,
		initializerArg: ReducerStateWithoutAction<R>,
		initializer?: undefined,
	): [ReducerStateWithoutAction<R>, DispatchWithoutAction];
	/**
	 * An alternative to `useState`.
	 *
	 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
	 * multiple sub-values. It also lets you optimize performance for components that trigger deep
	 * updates because you can pass `dispatch` down instead of callbacks.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useReducer
	 */
	// overload where "I" may be a subset of ReducerState<R>; used to provide autocompletion.
	// If "I" matches ReducerState<R> exactly then the last overload will allow initializer to be omitted.
	// the last overload effectively behaves as if the identity function (x => x) is the initializer.
	function useReducer<R extends Reducer<any, any>, I>(
		reducer: R,
		initializerArg: I & ReducerState<R>,
		initializer: (arg: I & ReducerState<R>) => ReducerState<R>,
	): [ReducerState<R>, Dispatch<ReducerAction<R>>];
	/**
	 * An alternative to `useState`.
	 *
	 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
	 * multiple sub-values. It also lets you optimize performance for components that trigger deep
	 * updates because you can pass `dispatch` down instead of callbacks.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useReducer
	 */
	// overload for free "I"; all goes as long as initializer converts it into "ReducerState<R>".
	function useReducer<R extends Reducer<any, any>, I>(
		reducer: R,
		initializerArg: I,
		initializer: (arg: I) => ReducerState<R>,
	): [ReducerState<R>, Dispatch<ReducerAction<R>>];
	/**
	 * An alternative to `useState`.
	 *
	 * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
	 * multiple sub-values. It also lets you optimize performance for components that trigger deep
	 * updates because you can pass `dispatch` down instead of callbacks.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useReducer
	 */

	// I'm not sure if I keep this 2-ary or if I make it (2,3)-ary; it's currently (2,3)-ary.
	// The Flow types do have an overload for 3-ary invocation with undefined initializer.

	// NOTE: without the ReducerState indirection, TypeScript would reduce S to be the most common
	// supertype between the reducer's return type and the initialState (or the initializer's return type),
	// which would prevent autocompletion from ever working.

	// TODO: double-check if this weird overload logic is necessary. It is possible it's either a bug
	// in older versions, or a regression in newer versions of the typescript completion service.
	function useReducer<R extends Reducer<any, any>>(
		reducer: R,
		initialState: ReducerState<R>,
		initializer?: undefined,
	): [ReducerState<R>, Dispatch<ReducerAction<R>>];
	/**
	 * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
	 * (`initialValue`). The returned object will persist for the full lifetime of the component.
	 *
	 * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
	 * value around similar to how you’d use instance fields in classes.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useRef
	 */
	function useRef<T>(initialValue: T): MutableRefObject<T>;
	// convenience overload for refs given as a ref prop as they typically start with a null value
	/**
	 * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
	 * (`initialValue`). The returned object will persist for the full lifetime of the component.
	 *
	 * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
	 * value around similar to how you’d use instance fields in classes.
	 *
	 * Usage note: if you need the result of useRef to be directly mutable, include `| null` in the type
	 * of the generic argument.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useRef
	 */
	function useRef<T>(initialValue: T | undefined): RefObject<T>;
	// convenience overload for potentially undefined initialValue / call with 0 arguments
	// has a default to stop it from defaulting to {} instead
	/**
	 * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
	 * (`initialValue`). The returned object will persist for the full lifetime of the component.
	 *
	 * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
	 * value around similar to how you’d use instance fields in classes.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useRef
	 */
	function useRef<T = undefined>(): MutableRefObject<T | undefined>;
	/**
	 * The signature is identical to `useEffect`, but it fires synchronously after all DOM mutations.
	 * Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside
	 * `useLayoutEffect` will be flushed synchronously, before the browser has a chance to paint.
	 *
	 * Prefer the standard `useEffect` when possible to avoid blocking visual updates.
	 *
	 * If you’re migrating code from a class component, `useLayoutEffect` fires in the same phase as
	 * `componentDidMount` and `componentDidUpdate`.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useLayoutEffect
	 */
	function useLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;
	/**
	 * Accepts a function that contains imperative, possibly effectful code.
	 *
	 * @param effect Imperative function that can return a cleanup function
	 * @param deps If present, effect will only activate if the values in the list change.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useEffect
	 */
	function useEffect(effect: EffectCallback, deps?: DependencyList): void;
	// NOTE: this does not accept strings, but this will have to be fixed by removing strings from type Ref<T>
	/**
	 * `useImperativeHandle` customizes the instance value that is exposed to parent components when using
	 * `ref`. As always, imperative code using refs should be avoided in most cases.
	 *
	 * `useImperativeHandle` should be used with `React.forwardRef`.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useImperativeHandle
	 */
	function useImperativeHandle<T, R extends T>(ref: Ref<T> | undefined, init: () => R, deps?: DependencyList): void;
	// I made 'inputs' required here and in useMemo as there's no point to memoizing without the memoization key
	// useCallback(X) is identical to just using X, useMemo(() => Y) is identical to just using Y.
	/**
	 * `useCallback` will return a memoized version of the callback that only changes if one of the `inputs`
	 * has changed.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useCallback
	 */
	// TODO (TypeScript 3.0): <T extends (...args: never[]) => unknown>
	function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
	/**
	 * `useMemo` will only recompute the memoized value when one of the `deps` has changed.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useMemo
	 */
	// allow undefined, but don't make it optional as that is very likely a mistake
	function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
	/**
	 * `useDebugValue` can be used to display a label for custom hooks in React DevTools.
	 *
	 * NOTE: We don’t recommend adding debug values to every custom hook.
	 * It’s most valuable for custom hooks that are part of shared libraries.
	 *
	 * @version 16.8.0
	 * @see https://react.dev/reference/react/useDebugValue
	 */
	// the name of the custom hook is itself derived from the function name at runtime:
	// it's just the function name without the "use" prefix.
	function useDebugValue<T>(value: T, format?: (value: T) => any): void;

	//
	// Props / DOM Attributes
	// ----------------------------------------------------------------------

	/**
	 * @deprecated This was used to allow clients to pass `ref` and `key`
	 * to `createElement`, which is no longer necessary due to intersection
	 * types. If you need to declare a props object before passing it to
	 * `createElement` or a factory, use `ClassAttributes<T>`:
	 *
	 * ```ts
	 * var b: Button | null;
	 * var props: ButtonProps & ClassAttributes<Button> = {
	 *     ref: b => button = b, // ok!
	 *     label: "I'm a Button"
	 * };
	 * ```
	 */
	interface Props<T> {
		children?: ReactNode | undefined;
		key?: Key | undefined;
		ref?: LegacyRef<T> | undefined;
	}

	interface HTMLProps<T> extends AllHTMLAttributes<T>, ClassAttributes<T> {}

	type DetailedHTMLProps<E extends HTMLAttributes<T>, T> = ClassAttributes<T> & E;

	interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes<T> {}

	interface SVGLineElementAttributes<T> extends SVGProps<T> {}
	interface SVGTextElementAttributes<T> extends SVGProps<T> {}

	interface DOMAttributes<T> {
		children?: ReactNode | undefined;
		dangerouslySetInnerHTML?:
			| {
					// Should be InnerHTML['innerHTML'].
					// But unfortunately we're mixing renderer-specific type declarations.
					__html: string | TrustedHTML;
			  }
			| undefined;
	}

	export interface CSSProperties {}

	// All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/
	interface AriaAttributes {}

	// All the WAI-ARIA 1.1 role attribute values from https://www.w3.org/TR/wai-aria-1.1/#role_definitions
	type AriaRole =
		| "alert"
		| "alertdialog"
		| "application"
		| "article"
		| "banner"
		| "button"
		| "cell"
		| "checkbox"
		| "columnheader"
		| "combobox"
		| "complementary"
		| "contentinfo"
		| "definition"
		| "dialog"
		| "directory"
		| "document"
		| "feed"
		| "figure"
		| "form"
		| "grid"
		| "gridcell"
		| "group"
		| "heading"
		| "img"
		| "link"
		| "list"
		| "listbox"
		| "listitem"
		| "log"
		| "main"
		| "marquee"
		| "math"
		| "menu"
		| "menubar"
		| "menuitem"
		| "menuitemcheckbox"
		| "menuitemradio"
		| "navigation"
		| "none"
		| "note"
		| "option"
		| "presentation"
		| "progressbar"
		| "radio"
		| "radiogroup"
		| "region"
		| "row"
		| "rowgroup"
		| "rowheader"
		| "scrollbar"
		| "search"
		| "searchbox"
		| "separator"
		| "slider"
		| "spinbutton"
		| "status"
		| "switch"
		| "tab"
		| "table"
		| "tablist"
		| "tabpanel"
		| "term"
		| "textbox"
		| "timer"
		| "toolbar"
		| "tooltip"
		| "tree"
		| "treegrid"
		| "treeitem"
		| (string & {});

	interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		// React-specific Attributes
		defaultChecked?: boolean | undefined;
		defaultValue?: string | number | ReadonlyArray<string> | undefined;
		suppressContentEditableWarning?: boolean | undefined;
		suppressHydrationWarning?: boolean | undefined;

		// Standard HTML Attributes
		accessKey?: string | undefined;
		autoFocus?: boolean | undefined;
		className?: string | undefined;
		contentEditable?: Booleanish | "inherit" | undefined;
		contextMenu?: string | undefined;
		dir?: string | undefined;
		draggable?: Booleanish | undefined;
		hidden?: boolean | undefined;
		id?: string | undefined;
		lang?: string | undefined;
		nonce?: string | undefined;
		placeholder?: string | undefined;
		slot?: string | undefined;
		spellCheck?: Booleanish | undefined;
		style?: CSSProperties | undefined;
		tabIndex?: number | undefined;
		title?: string | undefined;
		translate?: "yes" | "no" | undefined;

		// Unknown
		radioGroup?: string | undefined; // <command>, <menuitem>

		// WAI-ARIA
		role?: AriaRole | undefined;

		// RDFa Attributes
		about?: string | undefined;
		content?: string | undefined;
		datatype?: string | undefined;
		inlist?: any;
		prefix?: string | undefined;
		property?: string | undefined;
		rel?: string | undefined;
		resource?: string | undefined;
		rev?: string | undefined;
		typeof?: string | undefined;
		vocab?: string | undefined;

		// Non-standard Attributes
		autoCapitalize?: string | undefined;
		autoCorrect?: string | undefined;
		autoSave?: string | undefined;
		color?: string | undefined;
		itemProp?: string | undefined;
		itemScope?: boolean | undefined;
		itemType?: string | undefined;
		itemID?: string | undefined;
		itemRef?: string | undefined;
		results?: number | undefined;
		security?: string | undefined;
		unselectable?: "on" | "off" | undefined;

		// Living Standard
		/**
		 * Hints at the type of data that might be entered by the user while editing the element or its contents
		 * @see https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute
		 */
		inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search" | undefined;
		/**
		 * Specify that a standard HTML element should behave like a defined custom built-in element
		 * @see https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is
		 */
		is?: string | undefined;
	}

	interface AllHTMLAttributes<T> extends HTMLAttributes<T> {
		// Standard HTML Attributes
		accept?: string | undefined;
		acceptCharset?: string | undefined;
		action?: string | undefined;
		allowFullScreen?: boolean | undefined;
		allowTransparency?: boolean | undefined;
		alt?: string | undefined;
		as?: string | undefined;
		async?: boolean | undefined;
		autoComplete?: string | undefined;
		autoPlay?: boolean | undefined;
		capture?: boolean | "user" | "environment" | undefined;
		cellPadding?: number | string | undefined;
		cellSpacing?: number | string | undefined;
		charSet?: string | undefined;
		challenge?: string | undefined;
		checked?: boolean | undefined;
		cite?: string | undefined;
		classID?: string | undefined;
		cols?: number | undefined;
		colSpan?: number | undefined;
		controls?: boolean | undefined;
		coords?: string | undefined;
		crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
		data?: string | undefined;
		dateTime?: string | undefined;
		default?: boolean | undefined;
		defer?: boolean | undefined;
		disabled?: boolean | undefined;
		download?: any;
		encType?: string | undefined;
		form?: string | undefined;
		formAction?: string | undefined;
		formEncType?: string | undefined;
		formMethod?: string | undefined;
		formNoValidate?: boolean | undefined;
		formTarget?: string | undefined;
		frameBorder?: number | string | undefined;
		headers?: string | undefined;
		height?: number | string | undefined;
		high?: number | undefined;
		href?: string | undefined;
		hrefLang?: string | undefined;
		htmlFor?: string | undefined;
		httpEquiv?: string | undefined;
		integrity?: string | undefined;
		keyParams?: string | undefined;
		keyType?: string | undefined;
		kind?: string | undefined;
		label?: string | undefined;
		list?: string | undefined;
		loop?: boolean | undefined;
		low?: number | undefined;
		manifest?: string | undefined;
		marginHeight?: number | undefined;
		marginWidth?: number | undefined;
		max?: number | string | undefined;
		maxLength?: number | undefined;
		media?: string | undefined;
		mediaGroup?: string | undefined;
		method?: string | undefined;
		min?: number | string | undefined;
		minLength?: number | undefined;
		multiple?: boolean | undefined;
		muted?: boolean | undefined;
		name?: string | undefined;
		noValidate?: boolean | undefined;
		open?: boolean | undefined;
		optimum?: number | undefined;
		pattern?: string | undefined;
		placeholder?: string | undefined;
		playsInline?: boolean | undefined;
		poster?: string | undefined;
		preload?: string | undefined;
		readOnly?: boolean | undefined;
		required?: boolean | undefined;
		reversed?: boolean | undefined;
		rows?: number | undefined;
		rowSpan?: number | undefined;
		sandbox?: string | undefined;
		scope?: string | undefined;
		scoped?: boolean | undefined;
		scrolling?: string | undefined;
		seamless?: boolean | undefined;
		selected?: boolean | undefined;
		shape?: string | undefined;
		size?: number | undefined;
		sizes?: string | undefined;
		span?: number | undefined;
		src?: string | undefined;
		srcDoc?: string | undefined;
		srcLang?: string | undefined;
		srcSet?: string | undefined;
		start?: number | undefined;
		step?: number | string | undefined;
		summary?: string | undefined;
		target?: string | undefined;
		type?: string | undefined;
		useMap?: string | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
		width?: number | string | undefined;
		wmode?: string | undefined;
		wrap?: string | undefined;
	}

	type HTMLAttributeReferrerPolicy =
		| ""
		| "no-referrer"
		| "no-referrer-when-downgrade"
		| "origin"
		| "origin-when-cross-origin"
		| "same-origin"
		| "strict-origin"
		| "strict-origin-when-cross-origin"
		| "unsafe-url";

	type HTMLAttributeAnchorTarget = "_self" | "_blank" | "_parent" | "_top" | (string & {});

	interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
		download?: any;
		href?: string | undefined;
		hrefLang?: string | undefined;
		media?: string | undefined;
		ping?: string | undefined;
		target?: HTMLAttributeAnchorTarget | undefined;
		type?: string | undefined;
		referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
	}

	interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {}

	interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
		alt?: string | undefined;
		coords?: string | undefined;
		download?: any;
		href?: string | undefined;
		hrefLang?: string | undefined;
		media?: string | undefined;
		referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
		shape?: string | undefined;
		target?: string | undefined;
	}

	interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {
		href?: string | undefined;
		target?: string | undefined;
	}

	interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
		cite?: string | undefined;
	}

	interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
		disabled?: boolean | undefined;
		form?: string | undefined;
		formAction?: string | undefined;
		formEncType?: string | undefined;
		formMethod?: string | undefined;
		formNoValidate?: boolean | undefined;
		formTarget?: string | undefined;
		name?: string | undefined;
		type?: "submit" | "reset" | "button" | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
	}

	interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
		height?: number | string | undefined;
		width?: number | string | undefined;
	}

	interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
		span?: number | undefined;
		width?: number | string | undefined;
	}

	interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {
		span?: number | undefined;
	}

	interface DataHTMLAttributes<T> extends HTMLAttributes<T> {
		value?: string | ReadonlyArray<string> | number | undefined;
	}

	interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {
		open?: boolean | undefined;
	}

	interface DelHTMLAttributes<T> extends HTMLAttributes<T> {
		cite?: string | undefined;
		dateTime?: string | undefined;
	}

	interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
		open?: boolean | undefined;
	}

	interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
		height?: number | string | undefined;
		src?: string | undefined;
		type?: string | undefined;
		width?: number | string | undefined;
	}

	interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
		disabled?: boolean | undefined;
		form?: string | undefined;
		name?: string | undefined;
	}

	interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
		acceptCharset?: string | undefined;
		action?: string | undefined;
		autoComplete?: string | undefined;
		encType?: string | undefined;
		method?: string | undefined;
		name?: string | undefined;
		noValidate?: boolean | undefined;
		target?: string | undefined;
	}

	interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {
		manifest?: string | undefined;
	}

	interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
		allow?: string | undefined;
		allowFullScreen?: boolean | undefined;
		allowTransparency?: boolean | undefined;
		/** @deprecated */
		frameBorder?: number | string | undefined;
		height?: number | string | undefined;
		loading?: "eager" | "lazy" | undefined;
		/** @deprecated */
		marginHeight?: number | undefined;
		/** @deprecated */
		marginWidth?: number | undefined;
		name?: string | undefined;
		referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
		sandbox?: string | undefined;
		/** @deprecated */
		scrolling?: string | undefined;
		seamless?: boolean | undefined;
		src?: string | undefined;
		srcDoc?: string | undefined;
		width?: number | string | undefined;
	}

	interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
		alt?: string | undefined;
		crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
		decoding?: "async" | "auto" | "sync" | undefined;
		height?: number | string | undefined;
		loading?: "eager" | "lazy" | undefined;
		referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
		sizes?: string | undefined;
		src?: string | undefined;
		srcSet?: string | undefined;
		useMap?: string | undefined;
		width?: number | string | undefined;
	}

	interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
		cite?: string | undefined;
		dateTime?: string | undefined;
	}

	type HTMLInputTypeAttribute =
		| "button"
		| "checkbox"
		| "color"
		| "date"
		| "datetime-local"
		| "email"
		| "file"
		| "hidden"
		| "image"
		| "month"
		| "number"
		| "password"
		| "radio"
		| "range"
		| "reset"
		| "search"
		| "submit"
		| "tel"
		| "text"
		| "time"
		| "url"
		| "week"
		| (string & {});

	interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
		accept?: string | undefined;
		alt?: string | undefined;
		autoComplete?: string | undefined;
		capture?: boolean | "user" | "environment" | undefined; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
		checked?: boolean | undefined;
		crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
		disabled?: boolean | undefined;
		enterKeyHint?: "enter" | "done" | "go" | "next" | "previous" | "search" | "send" | undefined;
		form?: string | undefined;
		formAction?: string | undefined;
		formEncType?: string | undefined;
		formMethod?: string | undefined;
		formNoValidate?: boolean | undefined;
		formTarget?: string | undefined;
		height?: number | string | undefined;
		list?: string | undefined;
		max?: number | string | undefined;
		maxLength?: number | undefined;
		min?: number | string | undefined;
		minLength?: number | undefined;
		multiple?: boolean | undefined;
		name?: string | undefined;
		pattern?: string | undefined;
		placeholder?: string | undefined;
		readOnly?: boolean | undefined;
		required?: boolean | undefined;
		size?: number | undefined;
		src?: string | undefined;
		step?: number | string | undefined;
		type?: HTMLInputTypeAttribute | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
		width?: number | string | undefined;
	}

	interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
		challenge?: string | undefined;
		disabled?: boolean | undefined;
		form?: string | undefined;
		keyType?: string | undefined;
		keyParams?: string | undefined;
		name?: string | undefined;
	}

	interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
		form?: string | undefined;
		htmlFor?: string | undefined;
	}

	interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
		value?: string | ReadonlyArray<string> | number | undefined;
	}

	interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
		as?: string | undefined;
		crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
		fetchpriority?: "high" | "low" | "auto";
		href?: string | undefined;
		hrefLang?: string | undefined;
		integrity?: string | undefined;
		media?: string | undefined;
		imageSrcSet?: string | undefined;
		referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
		sizes?: string | undefined;
		type?: string | undefined;
		charSet?: string | undefined;
	}

	interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
		name?: string | undefined;
	}

	interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
		type?: string | undefined;
	}

	interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
		autoPlay?: boolean | undefined;
		controls?: boolean | undefined;
		controlsList?: string | undefined;
		crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
		loop?: boolean | undefined;
		mediaGroup?: string | undefined;
		muted?: boolean | undefined;
		playsInline?: boolean | undefined;
		preload?: string | undefined;
		src?: string | undefined;
	}

	interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
		charSet?: string | undefined;
		httpEquiv?: string | undefined;
		name?: string | undefined;
		media?: string | undefined;
	}

	interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
		form?: string | undefined;
		high?: number | undefined;
		low?: number | undefined;
		max?: number | string | undefined;
		min?: number | string | undefined;
		optimum?: number | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
	}

	interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
		cite?: string | undefined;
	}

	interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
		classID?: string | undefined;
		data?: string | undefined;
		form?: string | undefined;
		height?: number | string | undefined;
		name?: string | undefined;
		type?: string | undefined;
		useMap?: string | undefined;
		width?: number | string | undefined;
		wmode?: string | undefined;
	}

	interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
		reversed?: boolean | undefined;
		start?: number | undefined;
		type?: "1" | "a" | "A" | "i" | "I" | undefined;
	}

	interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
		disabled?: boolean | undefined;
		label?: string | undefined;
	}

	interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
		disabled?: boolean | undefined;
		label?: string | undefined;
		selected?: boolean | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
	}

	interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
		form?: string | undefined;
		htmlFor?: string | undefined;
		name?: string | undefined;
	}

	interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
		name?: string | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
	}

	interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
		max?: number | string | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
	}

	interface SlotHTMLAttributes<T> extends HTMLAttributes<T> {
		name?: string | undefined;
	}

	interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
		async?: boolean | undefined;
		/** @deprecated */
		charSet?: string | undefined;
		crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
		defer?: boolean | undefined;
		integrity?: string | undefined;
		noModule?: boolean | undefined;
		referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
		src?: string | undefined;
		type?: string | undefined;
	}

	interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
		autoComplete?: string | undefined;
		disabled?: boolean | undefined;
		form?: string | undefined;
		multiple?: boolean | undefined;
		name?: string | undefined;
		required?: boolean | undefined;
		size?: number | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
	}

	interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
		height?: number | string | undefined;
		media?: string | undefined;
		sizes?: string | undefined;
		src?: string | undefined;
		srcSet?: string | undefined;
		type?: string | undefined;
		width?: number | string | undefined;
	}

	interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
		media?: string | undefined;
		scoped?: boolean | undefined;
		type?: string | undefined;
	}

	interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
		cellPadding?: number | string | undefined;
		cellSpacing?: number | string | undefined;
		summary?: string | undefined;
		width?: number | string | undefined;
	}

	interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
		autoComplete?: string | undefined;
		cols?: number | undefined;
		dirName?: string | undefined;
		disabled?: boolean | undefined;
		form?: string | undefined;
		maxLength?: number | undefined;
		minLength?: number | undefined;
		name?: string | undefined;
		placeholder?: string | undefined;
		readOnly?: boolean | undefined;
		required?: boolean | undefined;
		rows?: number | undefined;
		value?: string | ReadonlyArray<string> | number | undefined;
		wrap?: string | undefined;
	}

	interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
		align?: "left" | "center" | "right" | "justify" | "char" | undefined;
		colSpan?: number | undefined;
		headers?: string | undefined;
		rowSpan?: number | undefined;
		scope?: string | undefined;
		abbr?: string | undefined;
		height?: number | string | undefined;
		width?: number | string | undefined;
		valign?: "top" | "middle" | "bottom" | "baseline" | undefined;
	}

	interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
		align?: "left" | "center" | "right" | "justify" | "char" | undefined;
		colSpan?: number | undefined;
		headers?: string | undefined;
		rowSpan?: number | undefined;
		scope?: string | undefined;
		abbr?: string | undefined;
	}

	interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
		dateTime?: string | undefined;
	}

	interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
		default?: boolean | undefined;
		kind?: string | undefined;
		label?: string | undefined;
		src?: string | undefined;
		srcLang?: string | undefined;
	}

	interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
		height?: number | string | undefined;
		playsInline?: boolean | undefined;
		poster?: string | undefined;
		width?: number | string | undefined;
		disablePictureInPicture?: boolean | undefined;
		disableRemotePlayback?: boolean | undefined;
	}

	// this list is "complete" in that it contains every SVG attribute
	// that React supports, but the types can be improved.
	// Full list here: https://facebook.github.io/react/docs/dom-elements.html
	//
	// The three broad type categories are (in order of restrictiveness):
	//   - "number | string"
	//   - "string"
	//   - union of string literals
	interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		// Attributes which also defined in HTMLAttributes
		// See comment in SVGDOMPropertyConfig.js
		className?: string | undefined;
		color?: string | undefined;
		height?: number | string | undefined;
		id?: string | undefined;
		lang?: string | undefined;
		max?: number | string | undefined;
		media?: string | undefined;
		method?: string | undefined;
		min?: number | string | undefined;
		name?: string | undefined;
		style?: CSSProperties | undefined;
		target?: string | undefined;
		type?: string | undefined;
		width?: number | string | undefined;

		// Other HTML properties supported by SVG elements in browsers
		role?: AriaRole | undefined;
		tabIndex?: number | undefined;
		crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;

		// SVG Specific attributes
		accentHeight?: number | string | undefined;
		accumulate?: "none" | "sum" | undefined;
		additive?: "replace" | "sum" | undefined;
		alignmentBaseline?:
			| "auto"
			| "baseline"
			| "before-edge"
			| "text-before-edge"
			| "middle"
			| "central"
			| "after-edge"
			| "text-after-edge"
			| "ideographic"
			| "alphabetic"
			| "hanging"
			| "mathematical"
			| "inherit"
			| undefined;
		allowReorder?: "no" | "yes" | undefined;
		alphabetic?: number | string | undefined;
		amplitude?: number | string | undefined;
		arabicForm?: "initial" | "medial" | "terminal" | "isolated" | undefined;
		ascent?: number | string | undefined;
		attributeName?: string | undefined;
		attributeType?: string | undefined;
		autoReverse?: Booleanish | undefined;
		azimuth?: number | string | undefined;
		baseFrequency?: number | string | undefined;
		baselineShift?: number | string | undefined;
		baseProfile?: number | string | undefined;
		bbox?: number | string | undefined;
		begin?: number | string | undefined;
		bias?: number | string | undefined;
		by?: number | string | undefined;
		calcMode?: number | string | undefined;
		capHeight?: number | string | undefined;
		clip?: number | string | undefined;
		clipPath?: string | undefined;
		clipPathUnits?: number | string | undefined;
		clipRule?: number | string | undefined;
		colorInterpolation?: number | string | undefined;
		colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit" | undefined;
		colorProfile?: number | string | undefined;
		colorRendering?: number | string | undefined;
		contentScriptType?: number | string | undefined;
		contentStyleType?: number | string | undefined;
		cursor?: number | string | undefined;
		cx?: number | string | undefined;
		cy?: number | string | undefined;
		d?: string | undefined;
		decelerate?: number | string | undefined;
		descent?: number | string | undefined;
		diffuseConstant?: number | string | undefined;
		direction?: number | string | undefined;
		display?: number | string | undefined;
		divisor?: number | string | undefined;
		dominantBaseline?: number | string | undefined;
		dur?: number | string | undefined;
		dx?: number | string | undefined;
		dy?: number | string | undefined;
		edgeMode?: number | string | undefined;
		elevation?: number | string | undefined;
		enableBackground?: number | string | undefined;
		end?: number | string | undefined;
		exponent?: number | string | undefined;
		externalResourcesRequired?: Booleanish | undefined;
		fill?: string | undefined;
		fillOpacity?: number | string | undefined;
		fillRule?: "nonzero" | "evenodd" | "inherit" | undefined;
		filter?: string | undefined;
		filterRes?: number | string | undefined;
		filterUnits?: number | string | undefined;
		floodColor?: number | string | undefined;
		floodOpacity?: number | string | undefined;
		focusable?: Booleanish | "auto" | undefined;
		fontFamily?: string | undefined;
		fontSize?: number | string | undefined;
		fontSizeAdjust?: number | string | undefined;
		fontStretch?: number | string | undefined;
		fontStyle?: number | string | undefined;
		fontVariant?: number | string | undefined;
		fontWeight?: number | string | undefined;
		format?: number | string | undefined;
		fr?: number | string | undefined;
		from?: number | string | undefined;
		fx?: number | string | undefined;
		fy?: number | string | undefined;
		g1?: number | string | undefined;
		g2?: number | string | undefined;
		glyphName?: number | string | undefined;
		glyphOrientationHorizontal?: number | string | undefined;
		glyphOrientationVertical?: number | string | undefined;
		glyphRef?: number | string | undefined;
		gradientTransform?: string | undefined;
		gradientUnits?: string | undefined;
		hanging?: number | string | undefined;
		horizAdvX?: number | string | undefined;
		horizOriginX?: number | string | undefined;
		href?: string | undefined;
		ideographic?: number | string | undefined;
		imageRendering?: number | string | undefined;
		in2?: number | string | undefined;
		in?: string | undefined;
		intercept?: number | string | undefined;
		k1?: number | string | undefined;
		k2?: number | string | undefined;
		k3?: number | string | undefined;
		k4?: number | string | undefined;
		k?: number | string | undefined;
		kernelMatrix?: number | string | undefined;
		kernelUnitLength?: number | string | undefined;
		kerning?: number | string | undefined;
		keyPoints?: number | string | undefined;
		keySplines?: number | string | undefined;
		keyTimes?: number | string | undefined;
		lengthAdjust?: number | string | undefined;
		letterSpacing?: number | string | undefined;
		lightingColor?: number | string | undefined;
		limitingConeAngle?: number | string | undefined;
		local?: number | string | undefined;
		markerEnd?: string | undefined;
		markerHeight?: number | string | undefined;
		markerMid?: string | undefined;
		markerStart?: string | undefined;
		markerUnits?: number | string | undefined;
		markerWidth?: number | string | undefined;
		mask?: string | undefined;
		maskContentUnits?: number | string | undefined;
		maskUnits?: number | string | undefined;
		mathematical?: number | string | undefined;
		mode?: number | string | undefined;
		numOctaves?: number | string | undefined;
		offset?: number | string | undefined;
		opacity?: number | string | undefined;
		operator?: number | string | undefined;
		order?: number | string | undefined;
		orient?: number | string | undefined;
		orientation?: number | string | undefined;
		origin?: number | string | undefined;
		overflow?: number | string | undefined;
		overlinePosition?: number | string | undefined;
		overlineThickness?: number | string | undefined;
		paintOrder?: number | string | undefined;
		panose1?: number | string | undefined;
		path?: string | undefined;
		pathLength?: number | string | undefined;
		patternContentUnits?: string | undefined;
		patternTransform?: number | string | undefined;
		patternUnits?: string | undefined;
		pointerEvents?: number | string | undefined;
		points?: string | undefined;
		pointsAtX?: number | string | undefined;
		pointsAtY?: number | string | undefined;
		pointsAtZ?: number | string | undefined;
		preserveAlpha?: Booleanish | undefined;
		preserveAspectRatio?: string | undefined;
		primitiveUnits?: number | string | undefined;
		r?: number | string | undefined;
		radius?: number | string | undefined;
		refX?: number | string | undefined;
		refY?: number | string | undefined;
		renderingIntent?: number | string | undefined;
		repeatCount?: number | string | undefined;
		repeatDur?: number | string | undefined;
		requiredExtensions?: number | string | undefined;
		requiredFeatures?: number | string | undefined;
		restart?: number | string | undefined;
		result?: string | undefined;
		rotate?: number | string | undefined;
		rx?: number | string | undefined;
		ry?: number | string | undefined;
		scale?: number | string | undefined;
		seed?: number | string | undefined;
		shapeRendering?: number | string | undefined;
		slope?: number | string | undefined;
		spacing?: number | string | undefined;
		specularConstant?: number | string | undefined;
		specularExponent?: number | string | undefined;
		speed?: number | string | undefined;
		spreadMethod?: string | undefined;
		startOffset?: number | string | undefined;
		stdDeviation?: number | string | undefined;
		stemh?: number | string | undefined;
		stemv?: number | string | undefined;
		stitchTiles?: number | string | undefined;
		stopColor?: string | undefined;
		stopOpacity?: number | string | undefined;
		strikethroughPosition?: number | string | undefined;
		strikethroughThickness?: number | string | undefined;
		string?: number | string | undefined;
		stroke?: string | undefined;
		strokeDasharray?: string | number | undefined;
		strokeDashoffset?: string | number | undefined;
		strokeLinecap?: "butt" | "round" | "square" | "inherit" | undefined;
		strokeLinejoin?: "miter" | "round" | "bevel" | "inherit" | undefined;
		strokeMiterlimit?: number | string | undefined;
		strokeOpacity?: number | string | undefined;
		strokeWidth?: number | string | undefined;
		surfaceScale?: number | string | undefined;
		systemLanguage?: number | string | undefined;
		tableValues?: number | string | undefined;
		targetX?: number | string | undefined;
		targetY?: number | string | undefined;
		textAnchor?: string | undefined;
		textDecoration?: number | string | undefined;
		textLength?: number | string | undefined;
		textRendering?: number | string | undefined;
		to?: number | string | undefined;
		transform?: string | undefined;
		u1?: number | string | undefined;
		u2?: number | string | undefined;
		underlinePosition?: number | string | undefined;
		underlineThickness?: number | string | undefined;
		unicode?: number | string | undefined;
		unicodeBidi?: number | string | undefined;
		unicodeRange?: number | string | undefined;
		unitsPerEm?: number | string | undefined;
		vAlphabetic?: number | string | undefined;
		values?: string | undefined;
		vectorEffect?: number | string | undefined;
		version?: string | undefined;
		vertAdvY?: number | string | undefined;
		vertOriginX?: number | string | undefined;
		vertOriginY?: number | string | undefined;
		vHanging?: number | string | undefined;
		vIdeographic?: number | string | undefined;
		viewBox?: string | undefined;
		viewTarget?: number | string | undefined;
		visibility?: number | string | undefined;
		vMathematical?: number | string | undefined;
		widths?: number | string | undefined;
		wordSpacing?: number | string | undefined;
		writingMode?: number | string | undefined;
		x1?: number | string | undefined;
		x2?: number | string | undefined;
		x?: number | string | undefined;
		xChannelSelector?: string | undefined;
		xHeight?: number | string | undefined;
		xlinkActuate?: string | undefined;
		xlinkArcrole?: string | undefined;
		xlinkHref?: string | undefined;
		xlinkRole?: string | undefined;
		xlinkShow?: string | undefined;
		xlinkTitle?: string | undefined;
		xlinkType?: string | undefined;
		xmlBase?: string | undefined;
		xmlLang?: string | undefined;
		xmlns?: string | undefined;
		xmlnsXlink?: string | undefined;
		xmlSpace?: string | undefined;
		y1?: number | string | undefined;
		y2?: number | string | undefined;
		y?: number | string | undefined;
		yChannelSelector?: string | undefined;
		z?: number | string | undefined;
		zoomAndPan?: string | undefined;
	}

	interface WebViewHTMLAttributes<T> extends HTMLAttributes<T> {
		allowFullScreen?: boolean | undefined;
		allowpopups?: boolean | undefined;
		autosize?: boolean | undefined;
		blinkfeatures?: string | undefined;
		disableblinkfeatures?: string | undefined;
		disableguestresize?: boolean | undefined;
		disablewebsecurity?: boolean | undefined;
		guestinstance?: string | undefined;
		httpreferrer?: string | undefined;
		nodeintegration?: boolean | undefined;
		partition?: string | undefined;
		plugins?: boolean | undefined;
		preload?: string | undefined;
		src?: string | undefined;
		useragent?: string | undefined;
		webpreferences?: string | undefined;
	}

	//
	// React.DOM
	// ----------------------------------------------------------------------

	interface ReactHTML {
		a: DetailedHTMLFactory<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
		abbr: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		address: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		area: DetailedHTMLFactory<AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
		article: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		aside: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		audio: DetailedHTMLFactory<AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
		b: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		base: DetailedHTMLFactory<BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
		bdi: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		bdo: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		big: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		blockquote: DetailedHTMLFactory<BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
		body: DetailedHTMLFactory<HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
		br: DetailedHTMLFactory<HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
		button: DetailedHTMLFactory<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
		canvas: DetailedHTMLFactory<CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
		caption: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		cite: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		code: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		col: DetailedHTMLFactory<ColHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
		colgroup: DetailedHTMLFactory<ColgroupHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
		data: DetailedHTMLFactory<DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>;
		datalist: DetailedHTMLFactory<HTMLAttributes<HTMLDataListElement>, HTMLDataListElement>;
		dd: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		del: DetailedHTMLFactory<DelHTMLAttributes<HTMLModElement>, HTMLModElement>;
		details: DetailedHTMLFactory<DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>;
		dfn: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		dialog: DetailedHTMLFactory<DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;
		div: DetailedHTMLFactory<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
		dl: DetailedHTMLFactory<HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
		dt: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		em: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		embed: DetailedHTMLFactory<EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
		fieldset: DetailedHTMLFactory<FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
		figcaption: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		figure: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		footer: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		form: DetailedHTMLFactory<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
		h1: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
		h2: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
		h3: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
		h4: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
		h5: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
		h6: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
		head: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLHeadElement>;
		header: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		hgroup: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		hr: DetailedHTMLFactory<HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
		html: DetailedHTMLFactory<HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
		i: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		iframe: DetailedHTMLFactory<IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
		img: DetailedHTMLFactory<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
		input: DetailedHTMLFactory<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
		ins: DetailedHTMLFactory<InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
		kbd: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		keygen: DetailedHTMLFactory<KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
		label: DetailedHTMLFactory<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
		legend: DetailedHTMLFactory<HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
		li: DetailedHTMLFactory<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
		link: DetailedHTMLFactory<LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
		main: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		map: DetailedHTMLFactory<MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
		mark: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		menu: DetailedHTMLFactory<MenuHTMLAttributes<HTMLElement>, HTMLElement>;
		menuitem: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		meta: DetailedHTMLFactory<MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
		meter: DetailedHTMLFactory<MeterHTMLAttributes<HTMLMeterElement>, HTMLMeterElement>;
		nav: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		noscript: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		object: DetailedHTMLFactory<ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>;
		ol: DetailedHTMLFactory<OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
		optgroup: DetailedHTMLFactory<OptgroupHTMLAttributes<HTMLOptGroupElement>, HTMLOptGroupElement>;
		option: DetailedHTMLFactory<OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
		output: DetailedHTMLFactory<OutputHTMLAttributes<HTMLOutputElement>, HTMLOutputElement>;
		p: DetailedHTMLFactory<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
		param: DetailedHTMLFactory<ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
		picture: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		pre: DetailedHTMLFactory<HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
		progress: DetailedHTMLFactory<ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement>;
		q: DetailedHTMLFactory<QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
		rp: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		rt: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		ruby: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		s: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		samp: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		slot: DetailedHTMLFactory<SlotHTMLAttributes<HTMLSlotElement>, HTMLSlotElement>;
		script: DetailedHTMLFactory<ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
		section: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		select: DetailedHTMLFactory<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
		small: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		source: DetailedHTMLFactory<SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>;
		span: DetailedHTMLFactory<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
		strong: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		style: DetailedHTMLFactory<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
		sub: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		summary: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		sup: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		table: DetailedHTMLFactory<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
		template: DetailedHTMLFactory<HTMLAttributes<HTMLTemplateElement>, HTMLTemplateElement>;
		tbody: DetailedHTMLFactory<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
		td: DetailedHTMLFactory<TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
		textarea: DetailedHTMLFactory<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
		tfoot: DetailedHTMLFactory<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
		th: DetailedHTMLFactory<ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
		thead: DetailedHTMLFactory<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
		time: DetailedHTMLFactory<TimeHTMLAttributes<HTMLTimeElement>, HTMLTimeElement>;
		title: DetailedHTMLFactory<HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
		tr: DetailedHTMLFactory<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
		track: DetailedHTMLFactory<TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
		u: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		ul: DetailedHTMLFactory<HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
		var: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		video: DetailedHTMLFactory<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
		wbr: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
		webview: DetailedHTMLFactory<WebViewHTMLAttributes<HTMLWebViewElement>, HTMLWebViewElement>;
	}

	interface ReactSVG {
		animate: SVGFactory;
		circle: SVGFactory;
		clipPath: SVGFactory;
		defs: SVGFactory;
		desc: SVGFactory;
		ellipse: SVGFactory;
		feBlend: SVGFactory;
		feColorMatrix: SVGFactory;
		feComponentTransfer: SVGFactory;
		feComposite: SVGFactory;
		feConvolveMatrix: SVGFactory;
		feDiffuseLighting: SVGFactory;
		feDisplacementMap: SVGFactory;
		feDistantLight: SVGFactory;
		feDropShadow: SVGFactory;
		feFlood: SVGFactory;
		feFuncA: SVGFactory;
		feFuncB: SVGFactory;
		feFuncG: SVGFactory;
		feFuncR: SVGFactory;
		feGaussianBlur: SVGFactory;
		feImage: SVGFactory;
		feMerge: SVGFactory;
		feMergeNode: SVGFactory;
		feMorphology: SVGFactory;
		feOffset: SVGFactory;
		fePointLight: SVGFactory;
		feSpecularLighting: SVGFactory;
		feSpotLight: SVGFactory;
		feTile: SVGFactory;
		feTurbulence: SVGFactory;
		filter: SVGFactory;
		foreignObject: SVGFactory;
		g: SVGFactory;
		image: SVGFactory;
		line: SVGFactory;
		linearGradient: SVGFactory;
		marker: SVGFactory;
		mask: SVGFactory;
		metadata: SVGFactory;
		path: SVGFactory;
		pattern: SVGFactory;
		polygon: SVGFactory;
		polyline: SVGFactory;
		radialGradient: SVGFactory;
		rect: SVGFactory;
		stop: SVGFactory;
		svg: SVGFactory;
		switch: SVGFactory;
		symbol: SVGFactory;
		text: SVGFactory;
		textPath: SVGFactory;
		tspan: SVGFactory;
		use: SVGFactory;
		view: SVGFactory;
	}

	interface ReactDOM extends ReactHTML, ReactSVG {}

	//
	// React.Children
	// ----------------------------------------------------------------------

	interface ReactChildren {
		map<T, C>(
			children: C | ReadonlyArray<C>,
			fn: (child: C, index: number) => T,
		): C extends undefined | undefined ? C : Array<Exclude<T, boolean | undefined | undefined>>;
		forEach<C>(children: C | ReadonlyArray<C>, fn: (child: C, index: number) => void): void;
		count(children: any): number;
		only<C>(children: C): C extends any[] ? never : C;
		toArray(children: ReactNode | ReactNode[]): Array<Exclude<ReactNode, boolean | undefined | undefined>>;
	}

	//
	// Browser Interfaces
	// https://github.com/nikeee/2048-typescript/blob/master/2048/js/touch.d.ts
	// ----------------------------------------------------------------------

	interface AbstractView {
		styleMedia: StyleMedia;
		document: Document;
	}

	interface Touch {
		identifier: number;
		target: EventTarget;
		screenX: number;
		screenY: number;
		clientX: number;
		clientY: number;
		pageX: number;
		pageY: number;
	}

	interface TouchList {
		[index: number]: Touch;
		length: number;
		item(index: number): Touch;
		identifiedTouch(identifier: number): Touch;
	}

	//
	// Error Interfaces
	// ----------------------------------------------------------------------
	interface ErrorInfo {
		/**
		 * Captures which component contained the exception, and its ancestors.
		 */
		componentStack: string;
	}

	namespace JSX {
		interface Element extends GlobalJSXElement {}
		interface ElementClass extends GlobalJSXElementClass {}
		interface ElementAttributesProperty extends GlobalJSXElementAttributesProperty {}
		interface ElementChildrenAttribute extends GlobalJSXElementChildrenAttribute {}

		type LibraryManagedAttributes<C, P> = GlobalJSXLibraryManagedAttributes<C, P>;

		interface IntrinsicAttributes extends GlobalJSXIntrinsicAttributes {}
		interface IntrinsicClassAttributes<T> extends GlobalJSXIntrinsicClassAttributes<T> {}
		interface IntrinsicElements extends GlobalJSXIntrinsicElements {}
	}
}

// React.JSX needs to point to global.JSX to keep global module augmentations intact.
// But we can't access global.JSX so we need to create these aliases instead.
// Once the global JSX namespace will be removed we replace React.JSX with the contents of global.JSX
interface GlobalJSXElement extends JSX.Element {}
interface GlobalJSXElementClass extends JSX.ElementClass {}
interface GlobalJSXElementAttributesProperty {}
interface GlobalJSXElementChildrenAttribute extends JSX.ElementChildrenAttribute {}

type GlobalJSXLibraryManagedAttributes<C, P> = JSX.LibraryManagedAttributes<C, P>;

interface GlobalJSXIntrinsicAttributes extends JSX.IntrinsicAttributes {}
interface GlobalJSXIntrinsicClassAttributes<T> extends JSX.IntrinsicClassAttributes<Instance> {}

interface GlobalJSXIntrinsicElements extends JSX.IntrinsicElements {}
