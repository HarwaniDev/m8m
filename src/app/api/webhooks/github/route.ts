import { NextResponse, type NextRequest } from "next/server";
import { inngest } from "~/inngest/client";

export async function POST(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const workflowId = url.searchParams.get("workflowId");

        if (!workflowId) {
            return NextResponse.json(
                { success: false, error: "Missing required query parameter: workflowId" },
                { status: 400 }
            )
        };

        const body = await request.json();

        const formData = {
            
            raw:body
        };
        await inngest.send({
            name: "workflows/execute.workflow",
            data: {
                workflowId,
                initialData: {
                    github: formData
                }
            }
        });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("error processing github event: ", error);
        return NextResponse.json(
            { success: false, error: "Failed to process github event" },
            { status: 500 }
        )
    }
}