export function apiResponse<T>({
  status = "success",
  message = "",
  content = [],
  total = 0
}: {
  status?: "success" | "error";
  message?: string;
  content?: T | T[];
  total?: number;
}) {
  return {
    info: {
      status,
      message,
      execution_time: new Date().toISOString()
    },
    total,
    content
  };
}
