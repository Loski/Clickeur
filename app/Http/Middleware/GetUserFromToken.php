<?php

/*
 * This file is part of jwt-auth.
 *
 * (c) Sean Tymon <tymon148@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace App\Http\Middleware;

use Dingo\Api\Routing\Helpers;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Middleware\BaseMiddleware;

class GetUserFromToken extends BaseMiddleware
{
    use Helpers;
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, \Closure $next)
    {
        if (! $token = $this->auth->setRequest($request)->getToken()) {
            return $this->response()->errorBadRequest('token not provided');
        }

        try {
            $user = $this->auth->authenticate($token);
        } catch (TokenExpiredException $e) {
            return $this->response()->error('token expired', $e->getStatusCode());
        } catch (JWTException $e) {
            return $this->response()->error('token invalid', $e->getStatusCode());
        }

        if (! $user) {
            return $this->response()->errorNotFound('user not found');
        }

        $this->events->fire('tymon.jwt.valid', $user);

        return $next($request);
    }
}
