import { logoutAction } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button className="buttonSecondary" type="submit">
        Log out
      </button>
    </form>
  );
}
