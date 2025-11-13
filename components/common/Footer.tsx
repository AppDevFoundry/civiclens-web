import React from "react";
import Link from "next/link";
import { APP_NAME } from "../../lib/utils/constant";

const Footer = () => (
  <footer>
    <div className="container">
      <Link href="/" className="logo-font">
        {APP_NAME.toLowerCase()}
      </Link>
      <span className="attribution">
        A platform for civic engagement and community building. Licensed under
        MIT.
      </span>
    </div>
  </footer>
);

export default Footer;
