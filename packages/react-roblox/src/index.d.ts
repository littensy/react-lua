import Roact from "@rbxts/roact";

export interface RootOptions {
	hydrate?: boolean;
	hydrationOptions?: {
		onHydrated?: (suspenseNode: any) => void;
		onDeleted?: (suspenseNode: any) => void;
		mutableSources?: any[];
	};
}

export interface Root {
	render(children: Roact.Element): void;
	unmount(): void;
}

export function createRoot(container: Instance, options?: RootOptions): Root;

export function createBlockingRoot(container: Instance, options?: RootOptions): Root;

export function createLegacyRoot(container: Instance, options?: RootOptions): Root;

/**
 *
 * @param children Anything that can be rendered with React, such as a piece
 * of JSX (e.g. `<div />` or `<SomeComponent />`), a
 * [Fragment](https://react.dev/reference/react/Fragment) (`<>...</>`), a
 * string or a number, or an array of these.
 * @param container The Roblox instance to portal to.
 * @param key A unique string or number to be used as the portal’s [key](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key).
 * @returns A React element that can be included into JSX or returned from a React component.
 */
export function createPortal(children: Roact.Element, container: Instance, key?: string): Roact.Element;
