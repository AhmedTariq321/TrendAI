"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface ExportButtonProps {
  data: string[];
  filename?: string;
}

export function ExportButton({ data, filename = "trendpilot-export" }: ExportButtonProps) {
  const exportTxt = () => {
    const blob = new Blob([data.join("\n\n---\n\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as TXT");
  };

  const exportCsv = () => {
    const csv = data.map((row, i) => `"${i + 1}","${row.replace(/"/g, '""')}"`).join("\n");
    const blob = new Blob([`"#","Content"\n${csv}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as CSV");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="gap-2" />}>
        <Download className="h-4 w-4" />
        Export
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportTxt}>Export as TXT</DropdownMenuItem>
        <DropdownMenuItem onClick={exportCsv}>Export as CSV</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
