import Link from "next/link";
import { FiHelpCircle } from "react-icons/fi";

type HelpButtonProps = {
  href: string;
  className?: string;
};

const HelpButton = ({ href, className = "" }: HelpButtonProps) => (
  <Link href={href} legacyBehavior passHref>
    <a
      target="_blank"
      rel="noopener noreferrer"
      title="ヘルプを見る"
      className={`ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-blue-500 hover:bg-gray-200 transition cursor-pointer ${className}`}
    >
      <FiHelpCircle size={16} />
    </a>
  </Link>
);

export default HelpButton;
