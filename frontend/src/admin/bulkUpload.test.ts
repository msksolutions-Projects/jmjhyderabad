import { describe, expect, it } from "vitest";
import { zipSync } from "fflate";
import { cleanZipName, collectFiles, folderOf, runPool, sourceKey, titleFor } from "./bulkUpload";

const file = (name: string, path = "", type = "image/jpeg") => {
  const f = new File([new Uint8Array([1, 2, 3])], name, { type });
  if (path) Object.defineProperty(f, "webkitRelativePath", { value: path });
  return f;
};

describe("bulk upload helpers", () => {
  it("names albums after Google Drive zips and folders", () => {
    expect(cleanZipName("Jubilee 2024-20261023T153012Z-001.zip")).toBe("Jubilee 2024");
    expect(cleanZipName("Senior Sister's Day (1).zip")).toBe("Senior Sister's Day");
    expect(folderOf("JMJ SUBODHA/IMG_1.jpg")).toBe("JMJ SUBODHA");
    expect(folderOf("Photos/Jubilee 2025/Mass/IMG_1.jpg")).toBe("Mass");
    expect(folderOf("IMG_1.jpg", "Fallback")).toBe("Fallback");
  });

  it("makes readable titles and replaces camera names", () => {
    expect(titleFor("Golden_jubilee_cake.jpg", "Jubilee 2024", 1)).toBe("Golden jubilee cake");
    expect(titleFor("IMG_20241102_101530.jpg", "Jubilee 2024", 7)).toBe("Jubilee 2024 · photo 7");
    expect(titleFor("WhatsApp Image 2025-01-04 at 10.15.22.jpeg", "JMJ SUBODHA", 2)).toBe("JMJ SUBODHA · photo 2");
    expect(titleFor("12.jpg", "", 3)).toBe("Gallery · photo 3");
    expect(sourceKey("Jubilee 2024", "a.jpg")).toBe("Jubilee 2024/a.jpg");
  });

  it("groups folder uploads by folder and leaves out non-photos", async () => {
    const { files, skipped } = await collectFiles([
      file("a.jpg", "Jubilee 2024/a.jpg"),
      file("b.png", "Jubilee 2024/b.png", "image/png"),
      file("c.jpg", "JMJ SUBODHA/c.jpg"),
      file("clip.mp4", "JMJ SUBODHA/clip.mp4", "video/mp4"),
      file(".DS_Store", "JMJ SUBODHA/.DS_Store", ""),
    ]);
    expect(files.map((f) => `${f.folder}/${f.name}`)).toEqual(["Jubilee 2024/a.jpg", "Jubilee 2024/b.png", "JMJ SUBODHA/c.jpg"]);
    expect(skipped).toEqual(["clip.mp4"]);
  });

  it("unpacks a Google Drive zip, using its folders as albums", async () => {
    const bytes = zipSync({
      "Jubilee 2025/IMG_1.jpg": new Uint8Array([1, 2]),
      "Jubilee 2025/Mass/IMG_2.JPG": new Uint8Array([3]),
      "loose.webp": new Uint8Array([4]),
      "notes.txt": new Uint8Array([104, 105]),
      "__MACOSX/Jubilee 2025/._IMG_1.jpg": new Uint8Array([5]),
    });
    const zip = new File([bytes as BlobPart], "Jubilee 2025-20261023T153012Z-001.zip", { type: "application/zip" });
    const { files, skipped } = await collectFiles([zip]);
    expect(files.map((f) => `${f.folder}|${f.name}|${f.blob.type}`).sort()).toEqual([
      "Jubilee 2025|IMG_1.jpg|image/jpeg",
      "Jubilee 2025|loose.webp|image/webp",
      "Mass|IMG_2.JPG|image/jpeg",
    ]);
    expect(skipped).toEqual(["notes.txt"]);
  });

  it("runs a limited number of uploads at once and can stop", async () => {
    let running = 0;
    let peak = 0;
    const seen: number[] = [];
    const ctrl = new AbortController();
    await runPool([1, 2, 3, 4, 5, 6, 7, 8], 3, async (n) => {
      running++;
      peak = Math.max(peak, running);
      await new Promise((r) => setTimeout(r, 5));
      seen.push(n);
      if (n === 4) ctrl.abort();
      running--;
    }, ctrl.signal);
    expect(peak).toBe(3);
    expect(seen.length).toBeLessThan(8);
  });
});
