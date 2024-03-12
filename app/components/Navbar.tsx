import Link from "next/link";

import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
// import { Icons } from "@/app/components/Icons";
import NavItems from "@/app/components/NavItems";
import Image from "next/image";
import eCommerceLogo from "../../public/E-Shop.jpg";

const Navbar = () => {
  return (
    <div className="bg-white sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              {/* TODO: Mobile Nav */}

              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  {/* <Icons.logo className="h-10 w-10" /> */}
                  <Image
                    src={eCommerceLogo}
                    alt="eCommerce logo"
                    className="h-16 w-16"
                  />
                </Link>
              </div>

              <div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch">
                <NavItems />
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
