import React, { createRef, Component, } from 'react';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders';

class Canvas extends Component {
	constructor(props) {
		super(props);
		this.canvasRef = createRef();
		//this.inputRef = createRef();
	}

	componentDidMount() {
		const engine = new BABYLON.Engine(this.canvasRef.current, true);

		// Load files
		const sceneLoadedCallback = function (sceneFile, scene) {
			scene.createDefaultCameraOrLight(true, true, true);
			scene.activeCamera.alpha += Math.PI;
			scene.clearColor = new BABYLON.Color3(0, 0, 0);
			engine.runRenderLoop(() => scene.render());
		}

		const filesInput = new BABYLON.FilesInput(engine, null, sceneLoadedCallback, null, null, function () {
			BABYLON.Tools.ClearLogCache();
		}, null, null);
		filesInput.monitorElementForDragNDrop(this.canvasRef.current);

		this.canvasRef.current.addEventListener('change', function (event) {
			filesInput.loadFiles(event);
		}, false);

		// Resize
		window.addEventListener('resize', () => engine.resize());

	}

	render() {
		return (
			<>
			<canvas ref={this.canvasRef} />
			</>
		);
	}
};

export default Canvas;

