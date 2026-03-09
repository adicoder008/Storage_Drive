import { constructDownloadUrl } from "@/lib/utils";

type Props = {
  params: { token: string };
};

export default function SharePreview({ params }: Props) {

  const [fileId] = params.token.split(":");

  const downloadUrl = constructDownloadUrl(fileId);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow-md text-center">

        <h1 className="text-2xl font-semibold mb-4">
          Shared File
        </h1>

        <p className="text-gray-500 mb-6">
          Someone shared a file with you.
        </p>

        <a
          href={downloadUrl}
          className="px-6 py-3 bg-red-500 text-white rounded-lg"
        >
          Download File
        </a>

      </div>

    </div>
  );
}