export default async function ({
  $auth,
  redirect
}) {
  let user = $auth.user;
  if (user.personnelType!=20) redirect("/")
}