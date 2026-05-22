import { ErrorPage } from "./ErrorPage";

export default function BadRequest() {
  return (
    <ErrorPage
      code="400"
      eyebrow="Bad Request"
      title="The request could not be processed."
      message="The page received invalid or incomplete information. Please check the link and try again."
    />
  );
}
