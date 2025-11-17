import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "~/components/ui/breadcrumb"
  import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
  } from "~/components/ui/sidebar"
  
  import { AppSidebar } from "~/components/ui/appsidebar"
  
  export default function Page() {
    return (
      <SidebarProvider className="bg-white text-blue-950">
        <AppSidebar />
        <SidebarInset className="bg-white">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-blue-100 bg-white">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 text-blue-900 border border-blue-200 hover:bg-blue-50" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#" className="text-blue-700 hover:text-blue-900">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block text-blue-300" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-blue-900">Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }
  