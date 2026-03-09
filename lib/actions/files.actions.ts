"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../actions/users.action";
import { generateFileHash } from "@/lib/hash";
import { generateShareToken } from "../share";

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

// export const uploadFile = async ({
//   file,
//   ownerId,
//   accountId,
//   path,
// }: UploadFileProps) => {
//   const { storage, database } = await createAdminClient();

//   try {
//     const inputFile = InputFile.fromBuffer(file, file.name);

//     const bucketFile = await storage.createFile(
//       appwriteConfig.bucketId,
//       ID.unique(),
//       inputFile,
//     );

//     const fileDocument = {
//       type: getFileType(bucketFile.name).type,
//       Name: bucketFile.name,
//       url: constructFileUrl(bucketFile.$id),
//       extension: getFileType(bucketFile.name).extension,
//       size: bucketFile.sizeOriginal,
//       owner: ownerId,
//       accountId,
//       users: [],
//       bucketFileId: bucketFile.$id,
//     };

//     const newFile = await database
//       .createDocument(
//         appwriteConfig.databaseId,
//         appwriteConfig.filesCollectionId,
//         ID.unique(),
//         fileDocument,
//       )
//       .catch(async (error: unknown) => {
//         await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
//         handleError(error, "Failed to create file document");
//       });

//     revalidatePath(path);
//     return parseStringify(newFile);
//   } catch (error) {
//     handleError(error, "Failed to upload file");
//   }
// };

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {

  const { storage, database } = await createAdminClient();

  const totalSpace = await getTotalSpaceUsed();

  if (!totalSpace) {
    throw new Error("Failed to retrieve storage information.");
  }

  if (totalSpace.used + file.size > totalSpace.all) {
    throw new Error("Storage quota exceeded. Delete files to upload more.");
  }

  try {

    // STEP 1 — generate hash
    const fileHash = await generateFileHash(file);

    // STEP 2 — check if file already exists
    const existingFiles = await database.listDocuments(
  appwriteConfig.databaseId,
  appwriteConfig.filesCollectionId,
  [Query.equal("fileHash", [fileHash])]
);

if (existingFiles.documents.length > 0) {
  // alert("File already exists. Skipping upload.");
  console.log("File with same hash already exists:", existingFiles.documents[0]);

  revalidatePath(path);
  return parseStringify(existingFiles.documents[0]);
}

    // STEP 3 — upload file if hash not found
    const buffer = Buffer.from(await file.arrayBuffer());
    const inputFile = InputFile.fromBuffer(buffer, file.name);

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );

    const fileType = getFileType(bucketFile.name);

    const fileDocument = {
      type: fileType.type,
      Name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: fileType.extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
      fileHash,
    };

    const newFile = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      ID.unique(),
      fileDocument
    );

    revalidatePath(path);

    return parseStringify(newFile);

  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};

const createQueries = (   // this is the exact function that we use in getFiles action, we just moved it out for better readability and maintainability
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number,
) => {

  if (!currentUser.Email) {
    throw new Error("User email not found");
  }

  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", currentUser.Email),
    ]),
  ];

  if (types.length > 0) queries.push(Query.equal("type", types));

  if (searchText) {
  queries.push(
    Query.or([
      Query.contains("Name", searchText),
      Query.contains("extension", searchText),
      Query.contains("type", searchText),
    ])
  );
}

  if (limit) queries.push(Query.limit(limit));

  if (sort) {
    const [sortBy, orderBy] = sort.split("-");

    queries.push(
      orderBy === "asc"
        ? Query.orderAsc(sortBy)
        : Query.orderDesc(sortBy)
    );
  }

  return queries;
};

export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit,
}: GetFilesProps) => {
  const { database } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("User not found");

    const queries = createQueries(currentUser, types, searchText, sort, limit);

    const files = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries,
    );

    console.log({ files });
    return parseStringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};

// export const renameFile = async ({
//   fileId,
//   name,
//   extension,
//   path,
// }: RenameFileProps) => {
//   const { database } = await createAdminClient();

//   try {
//     const newName = `${name}.${extension}`;
//     const updatedFile = await database.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.filesCollectionId,
//       fileId,
//       {
//         name: newName,
//       },
//     );

//     revalidatePath(path);
//     return parseStringify(updatedFile);
//   } catch (error) {
//     handleError(error, "Failed to rename file");
//   }
// };

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { database } = await createAdminClient();

  try {
    const newName = `${name}.${extension}`;

    const updatedFile = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        Name: newName,
      }
    );

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

export const updateFileUsers = async ({
  fileId,
  email,
  path,
}: {
  fileId: string;
  email: string;
  path: string;
}) => {

  const { database } = await createAdminClient();

  try {

    const file = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );

    const existingUsers = file.users || []; // in case users field is missing, we treat it as empty array

    const updatedUsers = Array.from(new Set([...existingUsers, email]));

    const updatedFile = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        users: updatedUsers,
      }
    );

    revalidatePath(path);

    return parseStringify(updatedFile);

  } catch (error) {
    handleError(error, "Failed to update shared users");
  }
};


export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProps) => {
  const { database, storage } = await createAdminClient();

  try {
    const deletedFile = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
    );

    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }

    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

// ============================== TOTAL FILE SPACE USED
export async function getTotalSpaceUsed() {
  try {
    const { database } = await createSessionClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User is not authenticated.");

    const files = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      [Query.equal("owner", [currentUser.$id])],
    );

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
    };

    files.documents.forEach((file) => {
      const fileType = file.type as FileType;
      totalSpace[fileType].size += file.size;
      totalSpace.used += file.size;

      if (
        !totalSpace[fileType].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
      ) {
        totalSpace[fileType].latestDate = file.$updatedAt;
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    handleError(error, "Error calculating total space used:, ");
  }
}


export async function generateShareLink(fileId: string) {
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

  const token = generateShareToken(fileId, expires);

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/share/${token}`;

  return link;
}
