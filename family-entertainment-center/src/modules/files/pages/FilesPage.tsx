import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/Card";

export function FilesPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">文件共享</h1>

      <Card>
        <CardHeader>
          <CardTitle>我的文件</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">暂无文件，开始上传您的第一个文件吧！</p>
        </CardContent>
      </Card>
    </div>
  );
}
