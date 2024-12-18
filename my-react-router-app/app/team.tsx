import type { Route } from "./+types/team";

// provides `loaderData` to the component
export async function loader({ params }: Route.LoaderArgs) {
    let team = await fetchTeam(params.teamId);
    return { name: team.name };
}

// renders after the loader is done
export default function Component({
                                      loaderData,
                                  }: Route.ComponentProps) {
    return <h1>{loaderData.name}</h1>;
}