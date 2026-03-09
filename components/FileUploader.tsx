'use client'
import React, { useCallback, useState } from "react";
import {useDropzone} from 'react-dropzone'
import { usePathname } from "next/navigation";
// import { useToast } from "@/hooks/use-toast";
import { MAX_FILE_SIZE } from "@/constants";
import { uploadFile } from "@/lib/actions/files.actions";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { convertFileToUrl, getFileType } from "@/lib/utils";
import Thumbnail from "@/components/Thumbnail";
import Image from "next/image";
import { generateShareLink } from "@/lib/actions/files.actions";

interface Props {
  ownerId: string;
  accountId: string;
  // className?: string;
}

const FileUploader = ({ ownerId, accountId }: Props) => {

  const path = usePathname();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {

    setFiles(acceptedFiles);

    const uploadPromises = acceptedFiles.map(async (file) => {

      try {

        // File size validation
        if (file.size > MAX_FILE_SIZE) {

          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name)
          );

          return toast.error(
            `${file.name} is too large. Max size is 50MB`
          );
        }

        const uploadedFile = await uploadFile({
          file,
          ownerId,
          accountId,
          path,
        });

        if (!uploadedFile) {
          throw new Error("Upload failed");
        }

        // remove from uploading list
        setFiles((prevFiles) =>
          prevFiles.filter((f) => f.name !== file.name)
        );

        // generate share link
        const link = await generateShareLink(uploadedFile.bucketFileId);

        // copy to clipboard
        await navigator.clipboard.writeText(link);

        toast.success("Share link copied to clipboard");

        console.log("Generated Share Link:", link);

      } catch (error: any) {

        console.error("Upload error:", error);

        toast.error(
          error?.message || "File upload failed"
        );

        setFiles((prevFiles) =>
          prevFiles.filter((f) => f.name !== file.name)
        );
      }

    });

    await Promise.all(uploadPromises);

  }, [ownerId, accountId, path]);

//   const onDrop = useCallback(async (acceptedFiles: File[]) => {

//   const file = acceptedFiles[0];

//   const hash = await generateFileHash(file);

//   console.log("FILE HASH:", hash);

// }, []); ---------->      Testing file hashing functionality. Uncomment and use in onDrop when needed.

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string,
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className="bg-red-400">
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />{" "}
        <p className="text-white">UPLOAD</p>
      </Button>
      {files.length > 0 && (
        <ul className="fixed bottom-10 right-10 z-50 flex size-full h-fit max-w-[480px] flex-col gap-3 rounded-[20px] bg-white p-7 shadow-drop-3 ">
          <h4 className="h4 text-light-100">Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between  gap-3 rounded-xl p-3 shadow-drop-3"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={80}
                      height={26}
                      alt="Loader"
                    />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;




