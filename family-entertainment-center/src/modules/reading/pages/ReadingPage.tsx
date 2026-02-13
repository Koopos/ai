import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/Card";

export function ReadingPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">阅读/读书</h1>

      <Card>
        <CardHeader>
          <CardTitle>我的书库</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">暂无书籍，开始添加您的第一本书吧！</p>
        </CardContent>
      </Card>
    </div>
  );
}
