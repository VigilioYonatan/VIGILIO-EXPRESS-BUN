declare module "quill-image-resize" {
	import type Quill from "quill";
	interface ImageResizeOptions {
		handleStyles?: {
			backgroundColor?: string;
			border?: string;
			borderRadius?: string;
			cursor?: string;
			display?: string;
			position?: string;
		};
		modules?: string[];
	}
	class QuillResize {
		constructor(quill: Quill, options?: ImageResizeOptions);
	}
	export default QuillResize;
}
