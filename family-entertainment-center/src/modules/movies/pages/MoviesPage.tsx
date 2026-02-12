import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/Card";

export function MoviesPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">电影</h1>

      <Card>
        <CardHeader>
          <CardTitle>我的电影库</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">暂无电影，开始添加您的第一部电影吧！</p>
        </CardContent>
      </Card>
    </div>
  );
}
