import React, { createRef, Component, } from 'react';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import { GLTF2Export, } from '@babylonjs/serializers/glTF';
import '@babylonjs/loaders';

function handleSelectHelp(mesh, highlight, canvas) {
	if (mesh && !highlight.hasMesh(mesh)) {
		const meshSelected = new CustomEvent('meshSelected', { detail: mesh, });
		canvas.dispatchEvent(meshSelected);
		highlight.removeAllMeshes();
		highlight.addMesh(mesh, BABYLON.Color3.Green());
	} else {
		const meshUnSelected = new Event('meshUnSelected');
		canvas.dispatchEvent(meshUnSelected)
		highlight.removeAllMeshes();
	}
}

class Editor extends Component {
	constructor(props) {
		super(props);
		this.canvasRef = createRef();
		this.xMoveRef = createRef();
		this.yMoveRef = createRef();
		this.zMoveRef = createRef();
		this.xRotateRef = createRef();
		this.yRotateRef = createRef();
		this.zRotateRef = createRef();
		this.aRotateRef = createRef();
		this.xScaleRef = createRef();
		this.yScaleRef = createRef();
		this.zScaleRef = createRef();
		this.colorRef = createRef();
		this.alphaRef = createRef();
		this.state = { mesh: null, uploaded: false, scene: null, highlight: null};
	}

	componentDidMount() {
		const engine = new BABYLON.Engine(this.canvasRef.current, true, { stencil: true, });
		const canvas = this.canvasRef.current;

		// Update state
		canvas.addEventListener('meshSelected',
			(e) => this.setState({ ...this.state, ...{ mesh: e.detail, }, }));
		canvas.addEventListener('meshUnSelected',
			() => this.setState({ ...this.state, ...{ mesh: null, }, }));
		canvas.addEventListener('sceneLoaded',
			(e) => this.setState({
				mesh: null,
				uploaded: true,
				scene: e.detail.scene,
				highlight: e.detail.highlight,
			}));

		// Load files
		const sceneLoadedCallback = function (sceneFile, scene) {
			// Add the highlight layer.
			const highlight = new BABYLON.HighlightLayer("hl1", scene);

			// Dispatch sceneLoaded event
			const sceneLoaded = new CustomEvent('sceneLoaded',
				{ detail: { scene, highlight, }, });
			canvas.dispatchEvent(sceneLoaded);

			// Set up camera, light, environment
			// scene.name = sceneFile.name;
			scene.createDefaultCameraOrLight(true, true, true);
			scene.activeCamera.alpha += Math.PI;
			scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.7);

			// Add event listener for scene
			scene.onPointerObservable.add(function(evt) {
				switch (evt.type) {
					case BABYLON.PointerEventTypes.POINTERDOWN:
						const mesh = evt.pickInfo.pickedMesh;
						handleSelectHelp(mesh, highlight, canvas);
						break;
					case BABYLON.PointerEventTypes.POINTERUP:
						break;
					case BABYLON.PointerEventTypes.POINTERTAP:
						break;
					case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
						break;
					default:
						break;
				}
			});

			engine.runRenderLoop(() => scene.render());
		};

		const filesInput = new BABYLON.FilesInput(
			engine,
			null,
			sceneLoadedCallback,
			null,
			null,
			() => BABYLON.Tools.ClearLogCache(),
			null,
			null
		);

		filesInput.monitorElementForDragNDrop(this.canvasRef.current);

		// Drag n drop event
		canvas.addEventListener('change', function (event) {
			filesInput.loadFiles(event);
		}, false);

		// If modelEditing provided, load it
		if (this.props.modelEditing) {
			let { filename, } = this.props.modelEditing;
			let token = this.props.token;

			fetch(`http://localhost:8000/models/${filename}`, {
				headers: {
					'Authorization': `bearer ${token}`,
				},
			})
				.then(res => res.blob()).then(res => {
					let url = (window.webkitURL || window.URL).createObjectURL(res);
					BABYLON.SceneLoader.Load('', url, engine, function (scene) {
						sceneLoadedCallback(undefined, scene);
						window.URL.revokeObjectURL(url);
					}, undefined, undefined, '.glb');

				});


		};

		// Resize
		window.addEventListener('resize', () => engine.resize());
	}

	render() {
		// Save scene server and update states
		const save = function(url, method, formData) {
			let setEditing = this.props.setEditing;
			let setModelEditing = this.props.setModelEditing;
			let token = this.props.token;
			fetch(url, {
				method,
				headers: {
					'Authorization': `bearer ${token}`,
				},
				body: formData
			})
				.then(res => {
					if (res.ok) {
						setEditing(false);
						setModelEditing(null);
					}
				})


		}.bind(this);

		// Move selected mesh to specified position
		const handleMove = function () {
			let mesh = this.state.mesh;
			let [x, y, z] = [
				+this.xMoveRef.current.value,
				+this.yMoveRef.current.value,
				+this.zMoveRef.current.value
			];
			if (mesh) {
				mesh.position = new BABYLON.Vector3(x, y, z);
			}

		}.bind(this);

		// Scale selected mesh by specified ratio
		const handleScale = function () {
			let mesh = this.state.mesh;
			let [x, y, z] = [
				+this.xScaleRef.current.value,
				+this.yScaleRef.current.value,
				+this.zScaleRef.current.value
			];
			if (mesh) {
				mesh.scaling = new BABYLON.Vector3(x, y, z);
			}

		}.bind(this);

		// Rotate selected mesh by specified angle
		const handleRotate = function () {
			let mesh = this.state.mesh;
			let [x, y, z, a] = [
				+this.xRotateRef.current.value,
				+this.yRotateRef.current.value,
				+this.zRotateRef.current.value,
				+this.aRotateRef.current.value
			];
			if (mesh) {
				mesh.rotate(new BABYLON.Vector3(x, y, z), a * Math.PI);
			}

		}.bind(this);

		// Change color of selected mesh
		const handleChangeColor = function () {
			let mesh = this.state.mesh;
			let scene = this.state.scene;
			let color = this.colorRef.current.value;
			if (mesh) {
				mesh.material= new BABYLON.StandardMaterial('color', scene);
				mesh.material.diffuseColor = BABYLON.Color3.FromHexString(color);
			}
		}.bind(this);

		// Change transparency of selected mesh
		const handleChangeAlpha = function () {
			let mesh = this.state.mesh;
			let alpha = +this.alphaRef.current.value;
			if (mesh) {
				mesh.material.alpha = alpha;
			}
		}.bind(this);

		// Cancel editing, update states
		const handleCancel = function () {
			this.props.setModelEditing(null);
			this.props.setEditing(false);
		}.bind(this);

		// Download scene to user machine
		const handleDownload = function () {
			let scene = this.state.scene;
			GLTF2Export.GLBAsync(scene, 'model').then((glb) => {
				glb.downloadFiles();
			});
		}.bind(this);

		// Save scene to server
		const handleSave = function () {
			let scene = this.state.scene;
			let modelEditing = this.props.modelEditing;

			GLTF2Export.GLBAsync(scene, 'model').then((glb) => {
				let formData = new FormData();
				formData.append('model', glb.glTFFiles['model.glb']);
				if (!modelEditing || modelEditing.public)
					save('http://localhost:8000/models', 'POST', formData);
				else
					save(`http://localhost:8000/models/${modelEditing.filename}`, 'PUT', formData);
			});

		}.bind(this);

		// Select/Unslect mesh
		const handleSelect = function (event) {
			let mesh = this.state.scene.meshes.find(m => m.id === event.target.id);
			let highlight = this.state.highlight;
			let canvas = this.canvasRef.current;
			handleSelectHelp(mesh, highlight, canvas);
		}.bind(this);

		return (
			<>
			{ !this.state.uploaded &&
				<h2 className="text-secondary text-center" id="drag-guide">Drag and Drop to Upload Model</h2>
			}
			<canvas ref={this.canvasRef} />
			<div id="edit" className="p-3">

			{ !this.state.mesh ||
				<>
				<div className="input-group mb-3">
				<div className="input-group-append">
				<button onClick={handleMove} className="btn btn-outline-secondary" type="button">Move</button>
				<span className="input-group-text bg-transparent">X</span>
				</div>
				<input type="number" ref={this.xMoveRef} step="0.01" className="text-white form-control bg-transparent"/>
				<div className="input-group-append">
				<span className="input-group-text bg-transparent">Y</span>
				</div>
				<input type="number" ref={this.yMoveRef} step="0.01" className="text-white form-control bg-transparent"/>
				<div className="input-group-append">
				<span className="input-group-text bg-transparent">Z</span>
				</div>
				<input type="number" ref={this.zMoveRef} step="0.01" className="text-white form-control bg-transparent"/>
				</div>

				<div className="input-group mb-3">
				<div className="input-group-append">
				<button onClick={handleScale} className="btn btn-outline-secondary" type="button">Scale</button>
				<span className="input-group-text bg-transparent">X</span>
				</div>
				<input type="number" ref={this.xScaleRef} step="0.01" className="text-white form-control bg-transparent"/>
				<div className="input-group-append">
				<span className="input-group-text bg-transparent">Y</span>
				</div>
				<input type="number" ref={this.yScaleRef} step="0.01" className="text-white form-control bg-transparent"/>
				<div className="input-group-append">
				<span className="input-group-text bg-transparent">Z</span>
				</div>
				<input type="number" ref={this.zScaleRef} step="0.01" className="text-white form-control bg-transparent"/>
				</div>

				<div className="input-group mb-3">
				<div className="input-group-append">
				<button onClick={handleRotate} className="btn btn-outline-secondary" type="button">Rotate</button>
				<span className="input-group-text bg-transparent">X</span>
				</div>
				<input type="number" ref={this.xRotateRef} step="0.01" className="text-white form-control bg-transparent"/>
				<div className="input-group-append">
				<span className="input-group-text bg-transparent">Y</span>
				</div>
				<input type="number" ref={this.yRotateRef} step="0.01" className="text-white form-control bg-transparent"/>
				<div className="input-group-append">
				<span className="input-group-text bg-transparent">Z</span>
				</div>
				<input type="number" ref={this.zRotateRef} step="0.01" className="text-white form-control bg-transparent"/>
				<div className="input-group-append">
				<span className="input-group-text bg-transparent">&pi;</span>
				</div>
				<input type="number" ref={this.aRotateRef} step="0.01" className="text-white form-control bg-transparent"/>
				</div>

				<div className="input-group mb-3">
				<div className="input-group-append">
				<button onClick={handleChangeColor} className="btn btn-outline-secondary" type="button">Change Color</button>
				</div>
				<input type="color" ref={this.colorRef} className="form-control bg-transparent" placeholder="1"/>
				</div>

				<div className="input-group mb-3">
				<div className="input-group-append">
				<button onClick={handleChangeAlpha} className="btn btn-outline-secondary" type="button">Change Alpha</button>
				</div>
				<input type="number" ref={this.alphaRef} steyp="0.01" min="0" max="1" className="text-white form-control bg-transparent"/>
				</div>

				</>
			}

			<button onClick={handleCancel} className="btn btn-outline-secondary mr-3">Cancel</button>
			{ this.state.uploaded &&
				<>
				<button onClick={handleDownload} className="btn btn-outline-secondary mr-3">Download</button>
				<button onClick={handleSave} className="btn btn-outline-secondary">Save</button>
				</>

			}

			</div>

			{ this.state.scene &&
				<div id="explorer" className="bg-transparent text-secondary overflow-auto border border-secondary rounded m-3">
				{ this.state.scene.meshes
					.filter(mesh => mesh.metadata)
					.map(mesh =>
						<button onClick={handleSelect} key={mesh.id} id={mesh.id} className="btn btn-block text-secondary">{mesh.name}</button>)
				}

				</div>
			}
			</>
		);
	}
};

export default Editor;

