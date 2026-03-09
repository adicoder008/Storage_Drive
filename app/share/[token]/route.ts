import { verifyShareToken } from "@/lib/share";
import { constructDownloadUrl } from "@/lib/utils";
// import {constructPreviewUrl} from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {

  try {

    const fileId = verifyShareToken(params.token);
    // const previewUrl=constructPreviewUrl(fileId);
    const previewUrl = `/share/preview/${params.token}`;

    const downloadUrl = constructDownloadUrl(fileId);

    // return NextResponse.redirect(downloadUrl);  //for downoading
    return NextResponse.redirect(previewUrl); //for preview


  } catch (error) {
    return new NextResponse("Invalid or expired link", { status: 403 });
  }
}