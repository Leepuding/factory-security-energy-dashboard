import { useRef, useState } from "react";
import {
  IconAlertTriangle,
  IconCloudUpload,
  IconFile3d,
  IconFileTypePdf,
  IconPlayerPlay,
  IconTrash,
} from "@tabler/icons-react";
import { acceptedExtensions, modelExtensions } from "../data/demoProfiles.js";

export function UploadStage({ files, quantity, error, onFilesChange, onQuantityChange, onFileError, onStart }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function addFiles(fileList) {
    const incoming = Array.from(fileList);
    const next = incoming.filter((file) => acceptedExtensions.has(file.name.split(".").pop()?.toLowerCase()));
    if (incoming.length !== next.length) onFileError("包含暂不支持的文件，请上传 STEP、STP、IGS、IGES、PDF、DWG 或 DXF。");
    onFilesChange([...files, ...next].slice(0, 8));
  }

  function drop(event) {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  }

  return (
    <section className="upload-stage stage-surface">
      <div className="upload-copy">
        <h2>上传一个零件的图纸</h2>
      </div>

      {error ? <div className="inline-error" role="alert"><IconAlertTriangle size={19} />{error}</div> : null}

      <button
        className={`single-upload-zone ${dragging ? "dragging" : ""}`}
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
      >
        <span className="upload-icon"><IconCloudUpload size={36} stroke={1.5} /></span>
        <strong>点击选择或拖拽图纸到这里</strong>
        <p>3D：STEP、STP、IGS、IGES　　2D：PDF、DWG、DXF</p>
        <small>单次最多 8 个文件，仅处理一个零件</small>
      </button>
      <input ref={inputRef} className="hidden-input" type="file" multiple accept=".step,.stp,.igs,.iges,.pdf,.dwg,.dxf" onChange={(event) => addFiles(event.target.files)} />

      {files.length ? (
        <div className="single-file-list">
          {files.map((file, index) => {
            const extension = file.name.split(".").pop()?.toLowerCase();
            const isModel = modelExtensions.has(extension);
            const Icon = isModel ? IconFile3d : IconFileTypePdf;
            return (
              <div className="single-file-row" key={`${file.name}-${file.size}-${index}`}>
                <span className={isModel ? "model" : "drawing"}><Icon size={21} /></span>
                <div><strong>{file.name}</strong><small>{isModel ? "3D 模型" : "2D 图纸"} · {(file.size / 1024 / 1024).toFixed(2)} MB</small></div>
                <button type="button" onClick={() => onFilesChange(files.filter((_, itemIndex) => itemIndex !== index))} aria-label={`删除 ${file.name}`}><IconTrash size={17} /></button>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="quote-start-bar">
        <label>
          <span>报价数量</span>
          <div><input aria-label="报价数量" type="number" min="1" value={quantity} onChange={(event) => onQuantityChange(event.target.value)} /><em>件</em></div>
        </label>
        <button className="primary-action" type="button" onClick={onStart}>
          <IconPlayerPlay size={19} />开始 AI 报价
        </button>
      </div>
    </section>
  );
}
