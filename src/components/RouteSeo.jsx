import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { resolveSeo } from "../config/seo";
import Seo from "./Seo";

export default function RouteSeo() {
  const { pathname } = useLocation();
  const { currentUser } = useAuth();
  const seo = resolveSeo(pathname, Boolean(currentUser));

  return (
    <Seo
      title={seo.title}
      description={seo.description}
      path={seo.path}
      noindex={seo.noindex}
      keywords={seo.keywords}
    />
  );
}
