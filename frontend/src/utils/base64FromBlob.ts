//! HELPER FUNCTION: To convert Blob to Base64 Data URL (eliminates URL.revokeObjectURL cleanup)
export const blobToBase64 = (blob: Blob, mimeType: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      //? Split the result to get just the base64 part and prefix it correctly
      resolve(
        `data:${mimeType};base64,${reader.result?.toString().split(",")[1]}`,
      );
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
