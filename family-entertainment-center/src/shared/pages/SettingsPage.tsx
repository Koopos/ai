import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";

export function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">设置</h1>

      <Card>
        <CardHeader>
          <CardTitle>用户设置</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">用户设置功能即将推出...</p>
        </CardContent>
      </Card>
    </div>
  );
}
