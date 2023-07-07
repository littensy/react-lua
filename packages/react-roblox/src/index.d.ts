import Roact from "@rbxts/react-ts";

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
