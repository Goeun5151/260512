package com.quotelog;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.korean.KoreanTextRecognizerOptions;

/**
 * 한국어 ML Kit 텍스트 인식 플러그인.
 * 기존 라틴 전용 플러그인이 한글을 알파벳 쓰레기값으로 인식하던 문제를 해결하기 위해
 * 한국어(한글+영문) 모델을 직접 사용한다.
 */
@CapacitorPlugin(name = "KoreanOcr")
public class KoreanOcrPlugin extends Plugin {

  @PluginMethod
  public void detectText(PluginCall call) {
    String encoded = call.getString("base64Image");
    if (encoded == null) {
      call.reject("No image is given!");
      return;
    }
    int rotation = call.getInt("rotation", 0);

    Bitmap bitmap;
    try {
      byte[] bytes = Base64.decode(encoded, Base64.DEFAULT);
      bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
    } catch (Exception e) {
      call.reject("Unable to parse image");
      return;
    }
    if (bitmap == null) {
      call.reject("Decoded image is null");
      return;
    }

    InputImage image = InputImage.fromBitmap(bitmap, rotation);
    TextRecognizer recognizer =
        TextRecognition.getClient(new KoreanTextRecognizerOptions.Builder().build());

    recognizer
        .process(image)
        .addOnSuccessListener(visionText -> {
          JSObject ret = new JSObject();
          ret.put("text", visionText.getText());

          JSArray lines = new JSArray();
          for (Text.TextBlock block : visionText.getTextBlocks()) {
            for (Text.Line line : block.getLines()) {
              JSObject lineObject = new JSObject();
              lineObject.put("text", line.getText());
              lines.put(lineObject);
            }
          }
          ret.put("lines", lines);
          call.resolve(ret);
        })
        .addOnFailureListener(e -> call.reject("Unable to process image!", e));
  }
}
