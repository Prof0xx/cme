$content = Get-Content -Path "client\src\components\ServiceList.tsx" -Raw
$pattern = '(?s)const getImagePath = \(path: string \| undefined\): string => \{.*?return `/service-examples/\$\{path\}`;\s+\};'
$replacement = @'
const getImagePath = (path: string | undefined): string => {
    if (!path) return 'https://placehold.co/600x400?text=No+Image+Available';
    
    // Handle URLs that are already absolute
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // Normalize backslashes to forward slashes
    const normalizedPath = path.replace(/\\/g, '/');
    
    // If the path already starts with /service-examples/, use it as is
    if (normalizedPath.startsWith('/service-examples/')) {
      return normalizedPath;
    }
    
    // If path starts with attached_assets/, replace with /service-examples/
    if (normalizedPath.startsWith('attached_assets/')) {
      return `/service-examples/${normalizedPath.replace('attached_assets/', '')}`;
    }
    
    // If path starts with a slash, try it directly
    if (normalizedPath.startsWith('/')) {
      return normalizedPath;
    }
    
    // Try adding /assets/ prefix if it might be in the assets directory
    if (normalizedPath.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
      return `/assets/${normalizedPath}`;
    }
    
    // Default: assume the filename is directly in service-examples
    return `/service-examples/${normalizedPath}`;
  };
'@

$newContent = [regex]::Replace($content, $pattern, $replacement, [System.Text.RegularExpressions.RegexOptions]::Singleline)
Set-Content -Path "client\src\components\ServiceList.tsx" -Value $newContent -Encoding UTF8
Write-Host "File updated successfully" 