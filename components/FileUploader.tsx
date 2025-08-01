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

interface Props {
  ownerId: string;
  accountId: string;
  // className?: string;
}

const FileUploader = ({ ownerId, accountId }: Props) => {

  const path = usePathname();
  

  //**Declares a React state variable** called `files`, initially an empty array.
//Stores an array of uploaded file objects (browser `File` type).
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback( async (acceptedFiles:File[]) => {
    // Do something with the files
    setFiles(acceptedFiles);
    const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name),
          );

          return toast(
            <p className="">
              <span className="font-semibold">{file.name}</span> is too large.
              Max file size is 50MB.
            </p>,
            { className: "error-toast" }
          );
        }

        return uploadFile({ file, ownerId, accountId, path }).then(
          (uploadedFile) => {
            if (uploadedFile) {
              setFiles((prevFiles) =>
                prevFiles.filter((f) => f.name !== file.name),
              );
            }
          },
        );
      });

      await Promise.all(uploadPromises);
    },
    [ownerId, accountId, path],
  );
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




