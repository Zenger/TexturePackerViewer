Try it online at: https://zenger.github.io/TexturePackerViewer

If you ever did game dev you've encountered TexturePacker Atlas Textures. They usually are an image with an associated XML file typically with contents similar to this:

```xml
<TextureAtlas imagePath="spritesheet_default.png">
	<SubTexture name="blue_body_circle.png" x="0" y="147" width="80" height="80"/>
	<SubTexture name="blue_body_rhombus.png" x="240" y="480" width="80" height="80"/>
	<SubTexture name="blue_body_square.png" x="176" y="0" width="80" height="80"/>
	<SubTexture name="blue_body_squircle.png" x="240" y="240" width="80" height="80"/>
	<SubTexture name="blue_hand_closed.png" x="480" y="143" width="35" height="34"/>
	<SubTexture name="blue_hand_open.png" x="508" y="211" width="34" height="38"/>
	<SubTexture name="blue_hand_peace.png" x="542" y="182" width="28" height="40"/>
	<SubTexture name="blue_hand_point.png" x="493" y="538" width="34" height="36"/>
	<SubTexture name="blue_hand_rock.png" x="472" y="278" width="36" height="38"/>
	<SubTexture name="blue_hand_thumb.png" x="525" y="386" width="32" height="38"/>
</TextureAtlas>
```
This tool simply lets you preview individual sprites in the atlas texture as well as get individual coordinates for individual sprites or get a JSON of the whole tree.
