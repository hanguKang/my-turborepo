/** @type {import('next').NextConfig} */
const nextConfig = {
     transpilePackages: ['@repo/ui'], // 👈 이게 있어야 packages/ui 변경사항을 즉시 감지합니다.
};

export default nextConfig;
