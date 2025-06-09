import {useState} from 'preact/hooks'
import "xp.css"
import type { JSX } from "preact";

type SubTexture = {
    name?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

export function App() {

    const [texture, setTexture] = useState<string | null>(null);
    const [textureName, setTextureName] = useState<string | null>(null);
    const [nodeList, setNodeList] = useState<SubTexture[]>([]);
    const [selectedNode, setSelectedNode] = useState<SubTexture | null>(null);

    const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

    const [copiedOk, setCopiedOk] = useState<boolean>(false);


    const handleUpload = (event: JSX.TargetedEvent<HTMLInputElement, Event>) => {
        const files = event.currentTarget.files;
        const fileArray = Array.from(files || []);
        if (fileArray.length !== 2) {
            alert("Please upload exactly two files: one XML and one texture file.");
            return;
        }


        const xmlFile = fileArray.find(file => file.name.endsWith('.xml'));
        const textureFile = fileArray.find(file =>
            file.name.endsWith('.png') || file.name.endsWith('.gif') || file.name.endsWith('.jpg')
        );

        const reader = new FileReader();
        reader.onload = () => {
            setTexture(reader.result as string)
            const image = new Image();
            image.onload = () => {
              setImageSize({ width: image.naturalWidth, height: image.naturalHeight });
            };
            image.src = reader.result as string;
        };

        reader.readAsDataURL(textureFile as Blob);

        if (xmlFile) {
            xmlFile.text()?.then((xmlContent) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, "application/xml");
            try {
                const title = xmlDoc.getElementsByTagName('TextureAtlas')[0].getAttribute('imagePath');
                setTextureName(title);
            } catch (error) {
                console.error("Error parsing XML:", error);
                alert("Invalid XML format.");
                return;
            }

            // get subtextures
            const subTextures = xmlDoc.getElementsByTagName('SubTexture');

            const nodes: SubTexture[] = [];
            for (let i = 0; i < subTextures.length; i++) {
                console.log(subTextures[i]);
                const subTexture = subTextures[i];
                const name = subTexture.getAttribute('name');
                const x = parseInt(subTexture.getAttribute('x') || '0', 10);
                const y = parseInt(subTexture.getAttribute('y') || '0', 10);
                const width = parseInt(subTexture.getAttribute('width') || '0', 10);
                const height = parseInt(subTexture.getAttribute('height') || '0', 10);

                nodes.push({name: name ?? "", x, y, width, height});
            }

            setNodeList(nodes);
        });
        }


    }

    const copyTree = () => {
        const tree = {
            name: textureName,
            width: imageSize && imageSize.width,
            height: imageSize && imageSize.height,
            subTextures: nodeList.map(node => ({
                name: node.name,
                x: node.x,
                y: node.y,
                width: node.width,
                height: node.height
            }))
        };

        navigator.clipboard.writeText(JSON.stringify(tree, null, 2)).then(() => {
            alert("Copied to clipboard.");
        }).catch(() => {
            alert("Failed to copy to clipboard.");
        });
    }

    const copyNodesOnly = () => {
        const nodes = nodeList.map(node => ({
            name: node.name,
            x: node.x,
            y: node.y,
            width: node.width,
            height: node.height
        }));

        navigator.clipboard.writeText(JSON.stringify(nodes, null, 2)).then(() => {
            alert("Copied nodes to clipboard.");
        }).catch(() => {
            alert("Failed to copy nodes to clipboard.");
        });
    }

    return (
        <div class="container">
            <br/>
            <p>Select a texture atlas file and an accompanying XML file</p>

            <hr/>
            {!texture ? <form class="main-form">
                <input multiple type="file" id="file" accept=".xml,.png,.png,.gif,.jpg" onChange={handleUpload}/>
            </form> : <div style={{display: "flex", flexDirection: "row", gap: "10px", marginTop: "20px"}}>
                <div style={{flex: 1, position: 'sticky', top: 0, height: 'fit-content'}}>
                    <div class="window" style={{ marginTop: "20px"}}>
                        <div class="title-bar">
                            <span class="title-bar-text">Atlas: {textureName}</span>
                        </div>
                        <div class="window-body"
                           >
                            <div
                              style={{
                                position: "relative",
                                width: imageSize?.width ?? 0,
                                height: imageSize?.height ?? 0,
                                backgroundImage: `url(${texture})`,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "contain",
                              }}
                            >
                              {nodeList.map((sprite) => (
                                <div
                                  key={sprite.name}
                                  style={{
                                    position: "absolute",
                                    left: sprite.x,
                                    top: sprite.y,
                                    width: sprite.width,
                                    height: sprite.height,
                                    border: selectedNode && selectedNode.name === sprite.name ? "3px dotted red": "",
                                    boxSizing: "border-box",
                                    cursor: "pointer",
                                  }}
                                  title={sprite.name}
                                    onClick={() => setSelectedNode(sprite)}
                                />
                              ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{flex: 2}}>
                    <div class="window" style={{ marginTop: "20px"}}>
                        <div class="title-bar">
                            <span class="title-bar-text">Node List</span>
                        </div>
                        <div class="window-body">
                            <ul class="tree-view">
                                <li>
                                    <details open>
                                        <summary>{textureName}</summary>
                                        <ul>
                                            {nodeList.map((node, index) => (
                                                <li key={index} onClick={() => {
                                                    setSelectedNode(node);
                                                }}>
                                                   <a href="#" onClick={(e) => e.preventDefault()}>{node.name}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                </li>
                            </ul>
                        </div>
                    </div>
                   <button style={{ marginTop: '5px'}} onClick={copyTree}>Copy Tree as JSON ⧉</button>
                   <button style={{ marginTop: '5px', marginLeft: '5px'}} onClick={copyNodesOnly}>Copy Nodes as JSON ⧉</button>
                </div>
               <div style={{flex: 1, position: 'sticky', top: 0, height: 'fit-content'}}>
                    <div class="window" style={{ marginTop: "20px"}}>
                        <div class="title-bar">
                            <span class="title-bar-text">Sprite Preview</span>
                        </div>
                        <div class="window-body">
                            {selectedNode && <div title="Sprite Preview" style={{
                                width: `${selectedNode.width}px`,
                                height: `${selectedNode.height}px`,
                                backgroundImage: `url(${texture})`,
                                backgroundPosition: `-${selectedNode.x}px -${selectedNode.y}px`,
                                backgroundRepeat: 'no-repeat',
                            }}/>}
                            {selectedNode && <div>
                                <p><strong>Name:</strong> {selectedNode.name}</p>
                                <p><strong>X:</strong> {selectedNode.x}</p>
                                <p><strong>Y:</strong> {selectedNode.y}</p>
                                <p><strong>Width:</strong> {selectedNode.width}</p>
                                <p><strong>Height:</strong> {selectedNode.height}</p>
                            </div>}
                        </div>
                    </div>

                   <div class="window" style={{ marginTop: '20px' }}>
                        <div class="title-bar">
                            <span class="title-bar-text">JSON</span>
                        </div>
                        <div class="window-body">
                            {selectedNode && <pre>
                                {JSON.stringify(selectedNode, null, 2)}
                            </pre>}
                        </div>
                    </div>
                   {copiedOk && <p>Copied to clipboard.</p>}
                   <button style={{ marginTop: '5px'}} onClick={() => {
                       navigator.clipboard.writeText( JSON.stringify(selectedNode, null, 2)).then(() => {
                           setCopiedOk(true);
                       })
                   }}>Copy ⧉</button>
                </div>
            </div>
            }


        </div>
    )
}
