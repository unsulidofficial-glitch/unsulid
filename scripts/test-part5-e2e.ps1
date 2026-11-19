# ==============================================================================
# UNSULID® Part 5 — Automated End-to-End Test Suite
# Tests all Acceptance Criteria across Auth, Cart, Checkout, Payments, Shipping, Admin
# ==============================================================================

$baseUrl = "http://localhost:3000/api"
$passed = 0
$failed = 0

function Assert-Test($condition, $testName) {
    if ($condition) {
        Write-Host "  ✅ PASS: $testName" -ForegroundColor Green
        $script:passed++
    } else {
        Write-Host "  ❌ FAIL: $testName" -ForegroundColor Red
        $script:failed++
    }
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  RUNNING UNSULID® PART 5 MASTER TEST SUITE" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

# ------------------------------------------------------------------------------
# TEST GROUP 1: PRODUCTS & STOREFRONT
# ------------------------------------------------------------------------------
Write-Host "[GROUP 1] Product Catalog & Launch Availability" -ForegroundColor Yellow
$productsRes = Invoke-RestMethod -Uri "$baseUrl/products" -Method GET
Assert-Test ($productsRes.success -eq $true) "GET /api/products returns success"
Assert-Test ($productsRes.products.Count -ge 2) "Catalog contains initial launch perfumes"

$hc = $productsRes.products | Where-Object { $_.slug -eq "high-class" }
$bl = $productsRes.products | Where-Object { $_.slug -eq "black" }
Assert-Test ($hc.name -eq "HIGH CLASS" -and $hc.isPurchasable -eq $true) "HIGH CLASS is purchasable at launch"
Assert-Test ($bl.name -eq "BLACK" -and $bl.isPurchasable -eq $true) "BLACK is purchasable at launch"

# ------------------------------------------------------------------------------
# TEST GROUP 2: MOBILE AUTHENTICATION & OTP
# ------------------------------------------------------------------------------
Write-Host "`n[GROUP 2] Customer Mobile OTP Authentication" -ForegroundColor Yellow
$testPhone = "9876543210"

# Send OTP
$otpSend = Invoke-RestMethod -Uri "$baseUrl/auth/send-otp" -Method POST -ContentType "application/json" -Body "{`"phone`":`"$testPhone`"}"
Assert-Test ($otpSend.success -eq $true) "OTP dispatched successfully"
Assert-Test ($otpSend.devOtp -ne $null) "Dev OTP generated for verification"
$devOtp = $otpSend.devOtp

# Cooldown test: Immediate resend must be rejected with 400
try {
    $resendReject = Invoke-RestMethod -Uri "$baseUrl/auth/send-otp" -Method POST -ContentType "application/json" -Body "{`"phone`":`"$testPhone`"}"
    Assert-Test ($false) "Immediate resend was not rejected"
} catch {
    Assert-Test ($true) "OTP cooldown enforced (Immediate resend rejected)"
}

# Invalid OTP test
try {
    $badVerify = Invoke-RestMethod -Uri "$baseUrl/auth/verify-otp" -Method POST -ContentType "application/json" -Body "{`"phone`":`"$testPhone`",`"otp`":`"000000`"}"
    Assert-Test ($false) "Invalid OTP was accepted"
} catch {
    Assert-Test ($true) "Invalid OTP rejected"
}

# Valid OTP test
$verifyRes = Invoke-RestMethod -Uri "$baseUrl/auth/verify-otp" -Method POST -ContentType "application/json" -Body "{`"phone`":`"$testPhone`",`"otp`":`"$devOtp`"}"
Assert-Test ($verifyRes.success -eq $true) "Valid OTP verified"
Assert-Test ($verifyRes.token -ne $null) "Session token issued"
$custToken = $verifyRes.token
$custHeaders = @{ "Authorization" = "Bearer $custToken" }

# Authenticated profile test
$meRes = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method GET -Headers $custHeaders
Assert-Test ($meRes.user.phone -eq "+91$testPhone") "Profile retrieves authenticated user"

# ------------------------------------------------------------------------------
# TEST GROUP 3: CUSTOMER ADDRESS MANAGEMENT
# ------------------------------------------------------------------------------
Write-Host "`n[GROUP 3] Customer Delivery Addresses" -ForegroundColor Yellow
$addrBody = @{
    fullName = "Rajesh Sharma"
    phone = "9876543210"
    houseBuilding = "Penthouse 402, Royal Residency"
    streetLocality = "Dumas Road, Vesu"
    city = "Surat"
    state = "Gujarat"
    pinCode = "395007"
    isDefault = $true
} | ConvertTo-Json

$addrRes = Invoke-RestMethod -Uri "$baseUrl/addresses" -Method POST -Headers $custHeaders -ContentType "application/json" -Body $addrBody
Assert-Test ($addrRes.success -eq $true) "Customer can save delivery address"
$addrId = $addrRes.address.id

$addrList = Invoke-RestMethod -Uri "$baseUrl/addresses" -Method GET -Headers $custHeaders
Assert-Test ($addrList.addresses.Count -ge 1) "Address listed in user account"

# ------------------------------------------------------------------------------
# TEST GROUP 4: CART & BACKEND PRICE VALIDATION
# ------------------------------------------------------------------------------
Write-Host "`n[GROUP 4] Cart & Authoritative Backend Calculation" -ForegroundColor Yellow
$calcBody = @{
    items = @(
        @{ productId = "high-class"; quantity = 1 }
    )
    paymentMethod = "PREPAID"
} | ConvertTo-Json

$calcRes = Invoke-RestMethod -Uri "$baseUrl/cart/calculate" -Method POST -ContentType "application/json" -Body $calcBody
Assert-Test ($calcRes.breakdown.subtotal -eq 1499) "Backend computes correct product price (HIGH CLASS = ₹1499)"
Assert-Test ($calcRes.breakdown.shippingFee -eq 0) "Complimentary shipping applied (Subtotal > ₹999 free threshold)"

# ------------------------------------------------------------------------------
# TEST GROUP 5: PROMO CODES / COUPONS
# ------------------------------------------------------------------------------
Write-Host "`n[GROUP 5] Coupon Code Validation & Application" -ForegroundColor Yellow
$couponRes = Invoke-RestMethod -Uri "$baseUrl/coupons/apply" -Method POST -ContentType "application/json" -Body '{"code":"WELCOME10","subtotal":1499}'
Assert-Test ($couponRes.isValid -eq $true) "Coupon WELCOME10 is valid"
Assert-Test ($couponRes.discount -eq 150) "10% discount accurately calculated (₹150 off)"

try {
    $badCoupon = Invoke-RestMethod -Uri "$baseUrl/coupons/apply" -Method POST -ContentType "application/json" -Body '{"code":"FAKECODE99","subtotal":1499}'
    Assert-Test ($false) "Fake coupon accepted"
} catch {
    Assert-Test ($true) "Invalid coupon code rejected"
}

# ------------------------------------------------------------------------------
# TEST GROUP 6: ORDER CREATION (COD & PREPAID)
# ------------------------------------------------------------------------------
Write-Host "`n[GROUP 6] Orders Lifecycle & Payments" -ForegroundColor Yellow

# COD Order
$codOrderBody = @{
    addressId = $addrId
    paymentMethod = "COD"
    items = @(
        @{ productId = "high-class"; quantity = 1 }
    )
} | ConvertTo-Json

$codOrderRes = Invoke-RestMethod -Uri "$baseUrl/orders" -Method POST -Headers $custHeaders -ContentType "application/json" -Body $codOrderBody
Assert-Test ($codOrderRes.success -eq $true) "COD Order created"
Assert-Test ($codOrderRes.order.orderStatus -eq "CONFIRMED") "COD Order marked CONFIRMED"
Assert-Test ($codOrderRes.order.paymentStatus -eq "PENDING") "COD Payment status is PENDING until delivery"
Assert-Test ($codOrderRes.order.codFee -eq 50) "COD handling fee (₹50) accurately added to order"
$codOrderNumber = $codOrderRes.order.orderNumber

# Tracking check
$trackRes = Invoke-RestMethod -Uri "$baseUrl/orders/$($codOrderRes.order.id)/tracking" -Method GET -Headers $custHeaders
Assert-Test ($trackRes.tracking.awbNumber -ne $null) "Shiprocket AWB assigned for Surat warehouse dispatch"
Assert-Test ($trackRes.tracking.pickupLocation -eq "UNSULID_SURAT") "Surat factory origin confirmed in tracking events"

# Prepaid Order + Razorpay
$prepaidOrderBody = @{
    addressId = $addrId
    paymentMethod = "PREPAID"
    items = @(
        @{ productId = "black"; quantity = 1 }
    )
} | ConvertTo-Json

$prepOrderRes = Invoke-RestMethod -Uri "$baseUrl/orders" -Method POST -Headers $custHeaders -ContentType "application/json" -Body $prepaidOrderBody
Assert-Test ($prepOrderRes.success -eq $true) "Prepaid Order created"
Assert-Test ($prepOrderRes.order.orderStatus -eq "PAYMENT_PENDING") "Prepaid order starts in PAYMENT_PENDING status"
Assert-Test ($prepOrderRes.razorpay.id -ne $null) "Razorpay gateway order initialized"

# Verify Razorpay signature
$verifyPaymentBody = @{
    orderId = $prepOrderRes.order.id
    razorpayOrderId = $prepOrderRes.razorpay.id
    razorpayPaymentId = "pay_sim_test_9988"
    razorpaySignature = "sig_sim_valid_signature_2026"
} | ConvertTo-Json

$verifyPayRes = Invoke-RestMethod -Uri "$baseUrl/payments/razorpay/verify" -Method POST -Headers $custHeaders -ContentType "application/json" -Body $verifyPaymentBody
Assert-Test ($verifyPayRes.success -eq $true) "Razorpay payment verified"
Assert-Test ($verifyPayRes.order.orderStatus -eq "CONFIRMED") "Order marked CONFIRMED after payment verification"
Assert-Test ($verifyPayRes.order.paymentStatus -eq "PAID") "Payment status updated to PAID"

# ------------------------------------------------------------------------------
# TEST GROUP 7: ADVANCED ADMIN CONTROL CENTER
# ------------------------------------------------------------------------------
Write-Host "`n[GROUP 7] Advanced Admin Control Center" -ForegroundColor Yellow

# Admin Login
$adminLogin = Invoke-RestMethod -Uri "$baseUrl/admin/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@unsulid.com","password":"Admin@Unsulid2026!"}'
Assert-Test ($adminLogin.success -eq $true -and $adminLogin.admin.role -eq "SUPER_ADMIN") "Super Admin authenticated"
$adminHeaders = @{ "Authorization" = "Bearer $($adminLogin.token)" }

# Dashboard Stats
$statsRes = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard/stats" -Method GET -Headers $adminHeaders
Assert-Test ($statsRes.stats.totalOrders -ge 2) "Admin dashboard reads real database orders"
Assert-Test ($statsRes.stats.totalSales -gt 0) "Admin dashboard computes real revenue"

# Change HIGH CLASS Price
$priceUpdate = Invoke-RestMethod -Uri "$baseUrl/admin/products/high-class/price" -Method PUT -Headers $adminHeaders -ContentType "application/json" -Body '{"sellingPrice":1599,"stock":245}'
Assert-Test ($priceUpdate.success -eq $true) "Admin updated HIGH CLASS selling price to ₹1599"

# Verify customer storefront sees new price
$pubProd = Invoke-RestMethod -Uri "$baseUrl/products/high-class" -Method GET
Assert-Test ($pubProd.product.sellingPrice -eq 1599) "Customer storefront immediately reflects new price without code change"

# Change Free Shipping Threshold & COD Fee
$shipUpdate = Invoke-RestMethod -Uri "$baseUrl/admin/settings/shipping" -Method PUT -Headers $adminHeaders -ContentType "application/json" -Body '{"freeShippingThreshold":1200,"standardShippingFee":120}'
Assert-Test ($shipUpdate.success -eq $true) "Admin updated Free Shipping Threshold to ₹1200"

$codUpdate = Invoke-RestMethod -Uri "$baseUrl/admin/settings/cod" -Method PUT -Headers $adminHeaders -ContentType "application/json" -Body '{"codEnabled":true,"codHandlingFee":75,"minCodOrderValue":500,"maxCodOrderValue":10000}'
Assert-Test ($codUpdate.success -eq $true) "Admin updated COD handling fee to ₹75"

# Historical orders retain original prices test
$histOrder = Invoke-RestMethod -Uri "$baseUrl/orders/$($codOrderRes.order.id)" -Method GET -Headers $custHeaders
Assert-Test ($histOrder.order.codFee -eq 50) "Historical order retains original COD fee (₹50) despite admin fee increase to ₹75"

# Audit Logs
$auditRes = Invoke-RestMethod -Uri "$baseUrl/admin/audit-logs" -Method GET -Headers $adminHeaders
Assert-Test ($auditRes.logs.Count -ge 3) "Audit trail records all price, shipping, and COD updates"

# Reset HIGH CLASS back to ₹1499 and free shipping to ₹999, COD fee to ₹50
$null = Invoke-RestMethod -Uri "$baseUrl/admin/products/high-class/price" -Method PUT -Headers $adminHeaders -ContentType "application/json" -Body '{"sellingPrice":1499,"stock":250}'
$null = Invoke-RestMethod -Uri "$baseUrl/admin/settings/shipping" -Method PUT -Headers $adminHeaders -ContentType "application/json" -Body '{"freeShippingThreshold":999,"standardShippingFee":99}'
$null = Invoke-RestMethod -Uri "$baseUrl/admin/settings/cod" -Method PUT -Headers $adminHeaders -ContentType "application/json" -Body '{"codEnabled":true,"codHandlingFee":50,"minCodOrderValue":500,"maxCodOrderValue":10000}'

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  TEST RESULTS: $passed PASSED, $failed FAILED" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "========================================================`n" -ForegroundColor Cyan

