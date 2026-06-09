import React, { useState } from 'react';
import { compressImage } from '../utils/imageCompressor';
import { uploadImage } from '../utils/storageUtils';
import { isFirebaseEnabled } from '../firebase';

export default function MissionCompleteModal({
  uid,
  stepId,
  missionId,
  missionTitle,
  onSave,
  onSkip,
}) {
  const [note, setNote] = useState('');
  const [images, setImages] = useState([]); // [{ blob, preview }]
  const [saving, setSaving] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert('이미지는 최대 5장까지 업로드할 수 있습니다.');
      return;
    }
    const compressed = await Promise.all(files.map((f) => compressImage(f)));
    const items = compressed.map((blob) => ({
      blob,
      preview: URL.createObjectURL(blob),
    }));
    setImages((prev) => [...prev, ...items].slice(0, 5));
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    let imageUrls = [];

    if (isFirebaseEnabled && uid && images.length > 0) {
      try {
        imageUrls = await Promise.all(
          images.map((img, i) => uploadImage(uid, stepId, missionId, i, img.blob))
        );
      } catch (e) {
        console.error('이미지 업로드 실패:', e);
        alert('이미지 업로드에 실패했습니다. 텍스트만 저장합니다.');
      }
    }

    setSaving(false);
    onSave({ note, imageUrls });
  };

  return (
    <div className="flex items-center justify-center min-h-full py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎯</div>
          <h3 className="text-2xl font-bold text-gray-800">미션 완료!</h3>
          <p className="text-sm text-blue-600 font-medium mt-1">{missionTitle}</p>
        </div>

        {/* 텍스트 기록 */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ✏️ 오늘 배운 점을 기록해보세요
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="예: 결측치 23개를 dropna()로 처리했다. isnull().sum()으로 먼저 확인하는 방법을 배웠다."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* 이미지 업로드 */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🖼️ 결과 화면 캡처 첨부{' '}
            <span className="text-gray-400 font-normal">
              (선택 · 최대 5장 · 200KB 자동 압축)
            </span>
          </label>

          {images.length < 5 && (
            <label className="flex items-center justify-center gap-2 cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-400 transition">
              <span className="text-gray-500 text-sm">📎 이미지 선택</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {images.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img.preview}
                    alt={`캡처 ${i + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition text-sm"
          >
            건너뛰기
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50"
          >
            {saving ? '저장 중...' : '저장하기 ✅'}
          </button>
        </div>
      </div>
    </div>
  );
}
