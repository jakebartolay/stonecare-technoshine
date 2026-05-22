import { ErrorPage } from "./ErrorPage";

export default function Maintenance() {
  return (
    <ErrorPage
      code="503"
      eyebrow="Service Unavailable"
      title="This section is temporarily unavailable."
      message="We may be updating the site or performing maintenance. Please check again shortly."
    />
  );
}
