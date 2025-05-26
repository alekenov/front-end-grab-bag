
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Download, Upload, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isDemoModeEnabled, resetDemoData, exportDemoData, importDemoData } from "@/utils/demoStorage";

export function DemoModeIndicator() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [importData, setImportData] = useState("");

  if (!isDemoModeEnabled()) {
    return null;
  }

  const handleReset = () => {
    resetDemoData();
    toast({
      title: "Демо данные сброшены",
      description: "Все данные возвращены к исходному состоянию",
    });
    setIsOpen(false);
    // Refresh the page to reload data
    window.location.reload();
  };

  const handleExport = () => {
    const data = exportDemoData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `demo-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Данные экспортированы",
      description: "Файл с демо данными загружен",
    });
  };

  const handleImport = () => {
    try {
      const success = importDemoData(importData);
      if (success) {
        toast({
          title: "Данные импортированы",
          description: "Демо данные успешно загружены",
        });
        setImportData("");
        setIsOpen(false);
        window.location.reload();
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      toast({
        title: "Ошибка импорта",
        description: "Неверный формат данных",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Badge 
          variant="outline" 
          className="fixed top-4 right-4 z-50 bg-amber-100 text-amber-800 border-amber-300 cursor-pointer hover:bg-amber-200 transition-colors"
        >
          <AlertTriangle className="h-3 w-3 mr-1" />
          ДЕМО РЕЖИМ
        </Badge>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Демо режим</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Приложение работает в демонстрационном режиме. Все данные сохраняются локально в браузере.
          </p>
          
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="w-full justify-start"
            >
              <Download className="h-4 w-4 mr-2" />
              Экспортировать данные
            </Button>
            
            <div className="space-y-2">
              <Button
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('import-file')?.click()}
                className="w-full justify-start"
              >
                <Upload className="h-4 w-4 mr-2" />
                Импортировать данные
              </Button>
              
              <input
                id="import-file"
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setImportData(event.target?.result as string);
                    };
                    reader.readAsText(file);
                  }
                }}
              />
              
              {importData && (
                <Button
                  size="sm"
                  onClick={handleImport}
                  className="w-full"
                >
                  Подтвердить импорт
                </Button>
              )}
            </div>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={handleReset}
              className="w-full justify-start"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Сбросить к исходным данным
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
