import { ErrorPage } from "./errors/ErrorPage";

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      eyebrow="Page Not Found"
      title="We could not find that page."
      message="The link may be incorrect, outdated, or moved. Please return home or try another section."
    />
  );
}
