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
            formId: body.formId,
            formTitle: body.formTitle,
            responseId: body.responseId,
            timestamp: body.timestamp,
            respondentEmail: body.respondentEmail,
            responses: body.responses,
            raw:body
        };
        await inngest.send({
            name: "workflows/execute.workflow",
            data: {
                workflowId,
                initialData: {
                    googleForm: formData
                }
            }
        });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("error processing google form submission: ", error);
        return NextResponse.json(
            { success: false, error: "Failed to process Google Form submission" },
            { status: 500 }
        )
    }
}