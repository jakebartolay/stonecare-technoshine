import { ErrorPage } from "./ErrorPage";

export default function Unauthorized() {
  return (
    <ErrorPage
      code="401"
      eyebrow="Unauthorized"
      title="This page needs authorized access."
      message="You may need to sign in or use an authorized link before viewing this page."
    />
  );
}
